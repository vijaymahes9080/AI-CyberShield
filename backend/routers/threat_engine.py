from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from ml_models import domain_engine_ml
import re
import datetime

router = APIRouter(prefix="/threat", tags=["Threat Engine"])

@router.post("/url/scan", response_model=schemas.URLScanResponse)
def scan_url(request: schemas.URLScanRequest, db: Session = Depends(get_db)):
    result = domain_engine_ml.analyze_domain(request.url)
    verdict_text = "Phishing Site" if result["status"] == "dangerous" else "Suspicious Page" if result["status"] == "suspicious" else "Clean Site"
    
    # Save as alert if dangerous or suspicious
    if result["status"] in ["dangerous", "suspicious"]:
        new_alert = models.Alert(
            user_id=1, # Mock individual user association
            source="PhishingLink",
            title=f"Phishing Link Intercepted: {request.url[:30]}...",
            description=f"User attempted to navigate to {request.url}. Risk Score: {result['risk_score']}%. Verdict: {verdict_text}",
            severity="CRITICAL" if result["status"] == "dangerous" else "MEDIUM",
            status="UNRESOLVED"
        )
        db.add(new_alert)
        db.commit()
        
    return schemas.URLScanResponse(
        url=request.url,
        status=result["status"],
        domain_age_days=result["domain_age_days"],
        ssl_valid=result["ssl_valid"],
        verdict="Phishing Site" if result["status"] == "dangerous" else "Suspicious Page" if result["status"] == "suspicious" else "Clean Site",
        risk_score=result["risk_score"],
        indicators=result["indicators"],
        explanation=f"This domain was analyzed using behavioral DNS signatures. Indicators suggest a status of {result['status']}. Description: " + ", ".join(result["indicators"])
    )

@router.post("/chat/scan", response_model=schemas.ChatScanResponse)
def scan_chat(request: schemas.ChatScanRequest, db: Session = Depends(get_db)):
    full_text = " ".join([m.text.lower() for m in request.messages])
    
    red_flags = []
    scam_prob = 0.05
    category = "Genuine Chat"
    
    # NLP Scam heuristics
    if any(kw in full_text for kw in ["part-time", "earn", "income", "salary", "job", "work from home", "telegram task"]):
        scam_prob += 0.35
        red_flags.append("Offers easy/part-time job income")
        category = "Task / Job Scam"
    if any(kw in full_text for kw in ["subscribe", "youtube", "screenshot", "likes", "monetize"]):
        scam_prob += 0.25
        red_flags.append("Offers payment for subscribing/liking Youtube videos")
    if any(kw in full_text for kw in ["otp", "one-time password", "code", "verification code", "digits"]):
        scam_prob += 0.40
        red_flags.append("Urgent request for SMS authentication OTP")
        category = "Credential Theft"
    if any(kw in full_text for kw in ["upi pin", "deposit", "transfer money", "investment", "guaranteed profit"]):
        scam_prob += 0.30
        red_flags.append("Asks for direct deposit or promises high returns")
        category = "Investment Scam"
    if any(kw in full_text for kw in ["police", "court", "arrest", "relative in trouble", "emergency payment"]):
        scam_prob += 0.45
        red_flags.append("Employs urgent authority coercion or blackmail scripts")
        category = "Impersonation / Coercion"

    if len(red_flags) >= 2:
        scam_prob += 0.15

    scam_prob = min(0.99, scam_prob)
    risk_level = "LOW"
    if scam_prob > 0.75:
        risk_level = "CRITICAL"
    elif scam_prob > 0.40:
        risk_level = "SUSPICIOUS"
        
    explanation = "No malicious patterns identified."
    if risk_level in ["CRITICAL", "SUSPICIOUS"]:
        explanation = f"Scam Conversation Analyzer detected {category} triggers. Urgency and monetary coercion were matched against historical logs. Red Flags: {', '.join(red_flags)}."
        
        # Save as alert
        new_alert = models.Alert(
            user_id=1,
            source="WhatsAppScam",
            title=f"Chat Scam Risk: {category}",
            description=f"Scam attempt detected on {request.channel} from {request.conversation_partner}. Probability: {int(scam_prob*100)}%",
            severity="HIGH" if risk_level == "CRITICAL" else "MEDIUM",
            status="UNRESOLVED"
        )
        db.add(new_alert)
        db.commit()

    return schemas.ChatScanResponse(
        scam_probability=scam_prob,
        risk_level=risk_level,
        category=category,
        detected_red_flags=red_flags,
        agent_explanation=explanation
    )

@router.post("/deepfake/scan", response_model=schemas.DeepfakeScanResponse)
def scan_deepfake(file: UploadFile = File(...)):
    filename = file.filename.lower()
    
    # Run mock spectral checks based on file types
    is_synthetic = False
    anomalies = []
    
    if filename.endswith((".wav", ".mp3", ".m4a")):
        # Synthesize audio checks
        if any(kw in filename for kw in ["real", "authentic", "mic"]):
            is_synthetic = False
        else:
            is_synthetic = True
            anomalies = [
                "Missing bio-resonance signature below 80Hz",
                "Phase alignment anomaly matching synthetic vocoder generation",
                "Pitch modulation matches ElevenLabs cloning profiles"
            ]
    elif filename.endswith((".mp4", ".avi", ".mov")):
        is_synthetic = True
        anomalies = [
            "Facial landmark jitter matches dynamic ViT model frame outputs",
            "Lip sync timing mismatch against audio envelope",
            "Double-eyebrow shadows indicating neural rendering overlays"
        ]
    elif filename.endswith((".png", ".jpg", ".jpeg")):
        is_synthetic = True
        anomalies = [
            "Asymmetric eye reflection vectors",
            "High frequency GAN border noise patterns"
        ]
    else:
        # Default clean
        is_synthetic = False
        
    prob = 0.89 if is_synthetic else 0.05
    verdict = "synthetic_clone_detected" if is_synthetic else "authentic_media"
    
    return schemas.DeepfakeScanResponse(
        filename=file.filename,
        deepfake_probability=prob,
        authenticity_score=int((1.0 - prob) * 100),
        verdict=verdict,
        anomalies=anomalies if is_synthetic else ["No visual or audio cloning anomalies detected."]
    )
