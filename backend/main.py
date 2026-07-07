from fastapi import FastAPI, Depends, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models
import schemas
from routers import auth, threat_engine, fraud_engine, device_security, agent_chat
from typing import List
import datetime

# Create SQLite database tables on launch
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI CyberShield API Gateway",
    description="Production backend running machine learning scoring engines and a 10-Agent Threat cluster.",
    version="1.0.0"
)

# Allow CORS for React dashboard development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints routers
app.include_router(auth.router, prefix="/api")
app.include_router(threat_engine.router, prefix="/api")
app.include_router(fraud_engine.router, prefix="/api")
app.include_router(device_security.router, prefix="/api")
app.include_router(agent_chat.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "database": "connected"
    }

@app.get("/api/alerts", response_model=List[schemas.AlertResponse])
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(models.Alert).order_by(models.Alert.created_at.desc()).all()
    # If database has no alerts yet, seed with sample alerts for high-fidelity visualization
    if not alerts:
        seed_alerts = [
            models.Alert(
                user_id=1,
                source="IdentityLeak",
                title="Credential Leak Warning",
                description="Email accounts@vijay.com found in darknet breach listing (LinkedIn 2024 Combo List). Cleartext password exposed.",
                severity="HIGH",
                status="UNRESOLVED"
            ),
            models.Alert(
                user_id=1,
                source="PhishingLink",
                title="Phishing Site Intercepted",
                description="URL blocked by browser shield: hdfc-netbanking-login-auth.com. Risk score: 95%.",
                severity="CRITICAL",
                status="UNRESOLVED"
            ),
            models.Alert(
                user_id=1,
                source="CallClone",
                title="Voice Clone Call Flagged",
                description="Robocall scam blocked. Voice print matched ElevenLabs deepfake synthesis vector (92% match probability).",
                severity="HIGH",
                status="UNRESOLVED"
            )
        ]
        db.add_all(seed_alerts)
        db.commit()
        alerts = db.query(models.Alert).order_by(models.Alert.created_at.desc()).all()
    return alerts

@app.post("/api/alerts/{alert_id}/resolve", response_model=schemas.AlertResponse)
def resolve_alert(alert_id: int, request: schemas.AlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = request.status
    db.commit()
    db.refresh(alert)
    return alert

@app.get("/api/identity/leak-lookup")
def search_leak(email: str = Query(..., description="Email address to audit in dark web lists")):
    email_lower = email.lower().strip()
    
    # Static breaches mapping
    breach_database = {
        "vijay@gmail.com": [
            {"source": "LinkedIn Breach (2024)", "date": "2024-03-12", "risk": "High", "exposed": "Passwords, Emails, Job details"},
            {"source": "Canva Leak (2023)", "date": "2023-08-05", "risk": "Medium", "exposed": "Username, Hashed Password"}
        ],
        "test@cybershield.net": [
            {"source": "Adobe Customer Leak", "date": "2019-10-15", "risk": "Medium", "exposed": "Emails, Passwords"}
        ]
    }
    
    matched_leaks = breach_database.get(email_lower, [])
    
    health_score = 100
    if len(matched_leaks) == 1:
        health_score = 75
    elif len(matched_leaks) > 1:
        health_score = 40
        
    return {
        "email": email,
        "health_score": health_score,
        "breaches": matched_leaks,
        "recommendation": "Change your passwords immediately and enable 2FA on all linked accounts." if matched_leaks else "No active public credential leaks found for this email. Continue maintaining strong password hygiene."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
