from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from decimal import Decimal
from datetime import datetime

# Authentication Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: str = "individual"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    mfa_enabled: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None


# URL Scanning Schemas
class URLScanRequest(BaseModel):
    url: str
    scan_screenshots: Optional[bool] = False

class URLScanResponse(BaseModel):
    url: str
    status: str # safe, suspicious, dangerous
    domain_age_days: int
    ssl_valid: bool
    verdict: str
    risk_score: int
    indicators: List[str]
    explanation: str


# Chat Scanning Schemas
class ChatMessage(BaseModel):
    sender: str # partner, user
    text: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatScanRequest(BaseModel):
    channel: str # WhatsApp, SMS, Telegram
    conversation_partner: str
    messages: List[ChatMessage]

class ScamIndicatorDetail(BaseModel):
    keyword: str
    nlp_class: str
    score: float

class ChatScanResponse(BaseModel):
    scam_probability: float
    risk_level: str
    category: str
    detected_red_flags: List[str]
    agent_explanation: str


# Deepfake Scanning Schemas
class DeepfakeScanResponse(BaseModel):
    filename: str
    deepfake_probability: float
    authenticity_score: int
    verdict: str
    anomalies: List[str]


# Transaction Schemas
class BehaviorMetadata(BaseModel):
    call_active_during_tx: bool = False
    screen_sharing_active: bool = False
    urgency_timer_seen: bool = False

class TransactionCreate(BaseModel):
    amount: float
    currency: str = "INR"
    method: str # UPI, NetBanking, Card, Crypto
    receiver_identifier: str
    behavior_metadata: Optional[BehaviorMetadata] = None

class TransactionResponse(BaseModel):
    id: int
    amount: float
    currency: str
    method: str
    receiver_identifier: str
    fraud_score: int
    risk_level: str
    status: str
    timestamp: datetime
    explanation: str
    timeline: List[Dict[str, Any]]

    class Config:
        from_attributes = True


# Device Schemas
class DeviceStatusUpdate(BaseModel):
    device_name: str
    os_type: str
    app_version: str
    camera_active: bool
    mic_active: bool
    trust_score: Optional[int] = 100

class DeviceResponse(BaseModel):
    id: int
    device_name: str
    os_type: str
    app_version: str
    trust_score: int
    camera_active: bool
    mic_active: bool
    last_ping: datetime

    class Config:
        from_attributes = True


# Alert Schemas
class AlertResponse(BaseModel):
    id: int
    source: str
    title: str
    description: str
    severity: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    status: str


# Agent Chat Schemas
class AgentChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default_session"

class AgentLogEntry(BaseModel):
    agent: str
    action: str

class AgentChatResponse(BaseModel):
    response: str
    session_id: str
    orchestrator_log: List[AgentLogEntry]
