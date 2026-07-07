import datetime
from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Numeric, Text
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="individual") # individual, family_admin, enterprise_admin, admin
    mfa_secret = Column(String, nullable=True)
    mfa_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    devices = relationship("Device", back_populates="owner", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    device_name = Column(String, nullable=False)
    os_type = Column(String, nullable=False) # Windows, macOS, Android, iOS, ChromeExtension
    app_version = Column(String, nullable=False)
    trust_score = Column(Integer, default=100)
    camera_active = Column(Boolean, default=False)
    mic_active = Column(Boolean, default=False)
    last_ping = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="devices")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    currency = Column(String, default="INR")
    method = Column(String, nullable=False) # UPI, NetBanking, Card, Crypto
    receiver_identifier = Column(String, nullable=False)
    fraud_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False) # LOW, SUSPICIOUS, DANGEROUS
    status = Column(String, nullable=False) # APPROVED, FLAGGED, BLOCKED, PENDING_OTP
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="transactions")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source = Column(String, nullable=False) # PhishingLink, WhatsAppScam, CallClone, EmailMalware, IdentityLeak
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String, default="UNRESOLVED") # UNRESOLVED, INVESTIGATING, RESOLVED, IGNORED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="alerts")


class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, nullable=False)
    status = Column(String, default="open") # open, investigating, closed
    coordinator_notes = Column(Text, nullable=True)
    collaborating_agents = Column(String, nullable=True) # Comma-separated agent names
    timeline_json = Column(Text, nullable=True) # Serialized JSON array of events
    agent_chat_logs_json = Column(Text, nullable=True) # Serialized agent discussions
    resolution_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    channel = Column(String, nullable=False) # WhatsApp, SMS, Telegram
    conversation_partner = Column(String, nullable=False) # e.g. Phone number
    messages_json = Column(Text, nullable=False) # Serialized JSON list of messages
    scam_probability = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
