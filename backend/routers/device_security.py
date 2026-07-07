from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import datetime

router = APIRouter(prefix="/device", tags=["Device Security"])

@router.post("/metrics", response_model=schemas.DeviceResponse)
def update_device_metrics(request: schemas.DeviceStatusUpdate, db: Session = Depends(get_db)):
    # Calculate a mock score based on features
    score = 100
    if request.camera_active:
        score -= 10
    if request.mic_active:
        score -= 5
    if request.os_type.lower() == "android" and request.app_version != "1.0.0":
        score -= 10
        
    score = max(5, score)
    
    # Check if device already registered for our mock user (user_id = 1)
    device = db.query(models.Device).filter(models.Device.user_id == 1, models.Device.device_name == request.device_name).first()
    
    if device:
        device.camera_active = request.camera_active
        device.mic_active = request.mic_active
        device.trust_score = score
        device.last_ping = datetime.datetime.utcnow()
    else:
        device = models.Device(
            user_id=1,
            device_name=request.device_name,
            os_type=request.os_type,
            app_version=request.app_version,
            trust_score=score,
            camera_active=request.camera_active,
            mic_active=request.mic_active
        )
        db.add(device)
        
    db.commit()
    db.refresh(device)
    
    # Save as alert if trust score drops below 75
    if score < 85:
        new_alert = models.Alert(
            user_id=1,
            source="DeviceSecurity",
            title=f"Device Security Risk: {device.device_name}",
            description=f"Device trust score dropped to {score}%. Active camera or mic indicators were flagged during silent app activity.",
            severity="MEDIUM",
            status="UNRESOLVED"
        )
        db.add(new_alert)
        db.commit()
        
    return device

@router.get("/status", response_model=schemas.DeviceResponse)
def get_device_status(db: Session = Depends(get_db)):
    device = db.query(models.Device).filter(models.Device.user_id == 1).first()
    if not device:
        # Create a default simulated desktop device
        device = models.Device(
            user_id=1,
            device_name="DESKTOP-VIJAY",
            os_type="Windows",
            app_version="1.4.2",
            trust_score=95,
            camera_active=False,
            mic_active=False
        )
        db.add(device)
        db.commit()
        db.refresh(device)
    return device
