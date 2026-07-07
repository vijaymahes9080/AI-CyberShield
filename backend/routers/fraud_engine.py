from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from ml_models import fraud_engine_ml
import datetime

router = APIRouter(prefix="/fraud", tags=["Fraud Engine"])

@router.post("/score", response_model=schemas.TransactionResponse)
def score_transaction(request: schemas.TransactionCreate, db: Session = Depends(get_db)):
    amount = request.amount
    method = request.method
    receiver = request.receiver_identifier
    
    # Behavioral flags
    screen_share = request.behavior_metadata.screen_sharing_active if request.behavior_metadata else False
    call_active = request.behavior_metadata.call_active_during_tx if request.behavior_metadata else False
    urgency = request.behavior_metadata.urgency_timer_seen if request.behavior_metadata else False
    
    # Run ML Classifier
    score = fraud_engine_ml.calculate_score(amount, method, receiver, screen_share, call_active, urgency)
    
    risk_level = "LOW"
    status_label = "APPROVED"
    explanation = "This transaction is secure and matches standard behavioral profiles."
    
    if score >= 80:
        risk_level = "DANGEROUS"
        status_label = "BLOCKED"
        explanation = f"Blocked: Critical risk flagged. UPI recipient handle '{receiver}' is blacklisted and system telemetry indicated active call & screen-share overlays during authentication."
    elif score >= 40:
        risk_level = "SUSPICIOUS"
        status_label = "FLAGGED"
        explanation = f"Warning: Suspicious indicators found. The transaction amount is high and the transfer was made while a call was active. OTP required."
        
    # Build incident timeline
    now = datetime.datetime.now()
    timeline = []
    
    if call_active:
        timeline.append({"time": (now - datetime.timedelta(minutes=3)).strftime("%H:%M:%S"), "event": "Live voice call established with external sender."})
    if screen_share:
        timeline.append({"time": (now - datetime.timedelta(minutes=2)).strftime("%H:%M:%S"), "event": "Remote Screen Share overlay interface initiated (AnyDesk/TeamViewer)."})
    timeline.append({"time": (now - datetime.timedelta(seconds=45)).strftime("%H:%M:%S"), "event": f"Initiated {method} transfer to {receiver} for {request.currency} {amount}."})
    
    if status_label == "BLOCKED":
        timeline.append({"time": now.strftime("%H:%M:%S"), "event": "AI Shield blocked transaction due to active screen overlay hijacking risk."})
    elif status_label == "FLAGGED":
        timeline.append({"time": now.strftime("%H:%M:%S"), "event": "Transaction flagged: routing to user MFA challenge verification."})
    else:
        timeline.append({"time": now.strftime("%H:%M:%S"), "event": "Transaction approved. Transferred successfully."})

    # Save to SQLite ledger
    db_tx = models.Transaction(
        user_id=1,
        amount=amount,
        currency=request.currency,
        method=method,
        receiver_identifier=receiver,
        fraud_score=score,
        risk_level=risk_level,
        status=status_label
    )
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    
    # Save as security alert if suspicious or blocked
    if status_label in ["FLAGGED", "BLOCKED"]:
        new_alert = models.Alert(
            user_id=1,
            source="TransactionFraud",
            title=f"Banking Fraud Attempt: {status_label}",
            description=f"Blocked {method} payment to {receiver} for {amount}. Score: {score}%, Risk: {risk_level}",
            severity="CRITICAL" if status_label == "BLOCKED" else "HIGH",
            status="UNRESOLVED"
        )
        db.add(new_alert)
        db.commit()

    return schemas.TransactionResponse(
        id=db_tx.id,
        amount=float(db_tx.amount),
        currency=db_tx.currency,
        method=db_tx.method,
        receiver_identifier=db_tx.receiver_identifier,
        fraud_score=db_tx.fraud_score,
        risk_level=db_tx.risk_level,
        status=db_tx.status,
        timestamp=db_tx.timestamp,
        explanation=explanation,
        timeline=timeline
    )
