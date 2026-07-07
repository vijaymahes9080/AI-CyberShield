# AI CyberShield — API Design Specification

This document details the REST API endpoints and WebSocket channels exposed by the FastAPI backend to interact with the dashboard, browser extensions, and background crawlers.

---

## 1. Authentication Endpoints

### POST `/api/auth/register`
Creates a new individual, family, or business tenant account.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!",
    "full_name": "John Doe",
    "role": "individual"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "id": "f5b8a0cb-120e-4ab8-a1c2-d34fb56789ab",
    "email": "user@example.com",
    "full_name": "John Doe",
    "mfa_qr_link": "https://api.cybershield.net/auth/mfa/qr/f5b8a0..."
  }
  ```

### POST `/api/auth/login`
Authenticates a user and issues a JWT token.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPassword123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "user": {
      "id": "f5b8a0cb-120e-4ab8-a1c2-d34fb56789ab",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "individual"
    }
  }
  ```

---

## 2. Security Threat Verification Endpoints

### POST `/api/threat/url/scan`
Examines a URL or domain signature for indicators of phishing or brand spoofing.
- **Request Body**:
  ```json
  {
    "url": "https://hdfc-netbanking-login-secure.in/login.php",
    "scan_screenshots": false
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "url": "https://hdfc-netbanking-login-secure.in/login.php",
    "status": "dangerous",
    "domain_age_days": 2,
    "ssl_valid": false,
    "verdict": "Phishing Attempt",
    "risk_score": 98,
    "indicators": [
      "No SSL certificate",
      "Domain age is under 5 days",
      "Impersonates official brand: HDFC Bank",
      "Known redirect loop pattern detected"
    ],
    "explanation": "This website is impersonating HDFC Bank. The domain was registered 2 days ago and has no valid SSL certificate. Do not input credentials."
  }
  ```

### POST `/api/threat/chat/scan`
Scans conversation sequences from WhatsApp, SMS, or Telegram to identify grooming, OTP theft, or job fraud.
- **Request Body**:
  ```json
  {
    "channel": "WhatsApp",
    "sender": "+1982736184",
    "messages": [
      "Hello, I am a manager from Amazon. You have been selected to work part-time from home.",
      "Just subscribe to this Youtube channel and send me a screenshot of confirmation, we will pay you 500 INR.",
      "Please give me your bank details and mobile OTP to transfer the sign-up bonus."
    ]
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "scam_probability": 0.96,
    "risk_level": "CRITICAL",
    "category": "Task scam / OTP coercion",
    "detected_red_flags": [
      "Amazon job impersonation",
      "Youtube subscribe monetization offer",
      "Request for banking details and OTP codes"
    ],
    "agent_explanation": "This conversation follows the classic part-time task scam. The scammer builds trust by paying a small initial reward and then asks for OTP details to compromise bank accounts."
  }
  ```

### POST `/api/threat/deepfake/scan`
Uploads visual or voice media to check for synthesized facial elements or cloned speech signatures.
- **Request Body**: Multipart form data with key `file` containing image/audio/video files.
- **Response (200 OK)**:
  ```json
  {
    "filename": "incoming_audio.wav",
    "deepfake_probability": 0.89,
    "authenticity_score": 11,
    "verdict": "synthetic_clone_detected",
    "anomalies": [
      "Missing low-frequency biological resonance",
      "Phase cancellation artifacts consistent with ElevenLabs synthetic speech",
      "Repetitive pitch intervals"
    ]
  }
  ```

---

## 3. Transaction Risk Scoring Endpoints

### POST `/api/fraud/score`
Scores UPI or bank transactions for anomalies.
- **Request Body**:
  ```json
  {
    "amount": 25000.00,
    "currency": "INR",
    "method": "UPI",
    "receiver_identifier": "scamster99@paytm",
    "sender_device_id": "f5b8a0cb-120e-4ab8-a1c2-d34fb56789ab",
    "behavior_metadata": {
      "call_active_during_tx": true,
      "screen_sharing_active": true,
      "urgency_timer_seen": true
    }
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "transaction_id": "8e9b4412-28df-4a6c-9491-b4fca8f49ad4",
    "fraud_score": 92,
    "risk_level": "DANGEROUS",
    "verdict": "BLOCKED",
    "explanation": "This transaction was blocked because a live call and screen-sharing were active during the transfer. The receiver UPI handle has been reported for investment fraud 12 times in the last 24 hours.",
    "timeline": [
      {"time": "14:20:01", "event": "Interactive call started with +1800-BANK"},
      {"time": "14:20:12", "event": "Screen share app (AnyDesk) initiated"},
      {"time": "14:21:40", "event": "UPI transaction interface opened"},
      {"time": "14:22:05", "event": "Blocked: high fraud score (92)"}
    ]
  }
  ```

---

## 4. Multi-Agent Assistant Socket / API

### POST `/api/agent/chat`
Submits a prompt to the Personal Security Assistant which routes it through the Agent Orchestrator.
- **Request Body**:
  ```json
  {
    "message": "I received this email from accounts@netflix-payment-update.com saying my card declined. Is this safe?",
    "session_id": "f3b392a8-12cd-41e9-a36c-dfc52899ab42"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "response": "This email is unsafe. The domain `netflix-payment-update.com` is spoofed and does not belong to Netflix. I have initialized a threat incident and queued a report.",
    "session_id": "f3b392a8-12cd-41e9-a36c-dfc52899ab42",
    "orchestrator_log": [
      {
        "agent": "Multi-Agent Orchestrator",
        "action": "Route query to Website Inspector & Threat Intel Agent"
      },
      {
        "agent": "Website Inspector",
        "action": "Verify domain netflix-payment-update.com. Results: age = 1 day, SSL issuer = Let's Encrypt, IP = 185.220.101.4."
      },
      {
        "agent": "Threat Intel Agent",
        "action": "Check vector DB. Matches phishing template campaign #884."
      },
      {
        "agent": "Incident Response Agent",
        "action": "Create Incident ID INC-2026-9817, flag email address as malicious."
      }
    ]
  }
  ```
