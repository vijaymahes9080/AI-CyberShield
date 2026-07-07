# AI CyberShield — Database Schema Blueprint

AI CyberShield utilizes a polyglot persistence architecture to handle structured relational transactions, unstructured high-frequency communication scans, and high-dimensional threat vector lookups.

---

## 1. PostgreSQL Schema (Relational Datastore)
PostgreSQL handles core accounts, transaction parameters, alerts metadata, and device profiles.

```sql
-- Core User Account
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'individual', -- individual, family_admin, enterprise_admin, admin, auditor
    mfa_secret VARCHAR(100),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Family or Enterprise Tenants
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    tier VARCHAR(50) DEFAULT 'free', -- free, premium, business, enterprise
    admin_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tenant Membership Table
CREATE TABLE tenant_members (
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tenant_id, user_id)
);

-- Device Profiles Managed
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    device_name VARCHAR(100) NOT NULL,
    os_type VARCHAR(50) NOT NULL, -- Windows, macOS, Android, iOS, ChromeExtension
    app_version VARCHAR(20) NOT NULL,
    trust_score INT DEFAULT 100,
    camera_active BOOLEAN DEFAULT FALSE,
    mic_active BOOLEAN DEFAULT FALSE,
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transaction Scoring Ledger
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    method VARCHAR(50) NOT NULL, -- UPI, NetBanking, Card, Crypto
    receiver_identifier VARCHAR(255) NOT NULL, -- UPI ID, Account Number, Wallet Address
    fraud_score INT NOT NULL, -- 0 to 100
    risk_level VARCHAR(20) NOT NULL, -- LOW, SUSPICIOUS, DANGEROUS
    status VARCHAR(50) NOT NULL, -- APPROVED, FLAGGED, BLOCKED, PENDING_OTP
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Real-time Incident Alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL, -- PhishingLink, WhatsAppScam, CallClone, EmailMalware, IdentityLeak
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'MEDIUM', -- LOW, MEDIUM, HIGH, CRITICAL
    status VARCHAR(20) DEFAULT 'UNRESOLVED', -- UNRESOLVED, INVESTIGATING, RESOLVED, IGNORED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. MongoDB Collections (Document Datastore)
MongoDB stores raw telemetry, scam chat transcripts, email payloads, and detailed multi-agent incident investigation trails.

### Collection: `incident_reports`
```json
{
  "_id": "ObjectId",
  "alert_id": "UUID (references alerts.id)",
  "status": "string (open, investigating, closed)",
  "coordinator_notes": "string",
  "collaborating_agents": ["ThreatIntel", "FraudInvestigator", "IncidentResponder"],
  "timeline": [
    {
      "timestamp": "ISODate",
      "event": "string",
      "actor": "string (System, AgentName, User)"
    }
  ],
  "agent_chat_logs": [
    {
      "sender": "string (AgentName)",
      "message": "string",
      "timestamp": "ISODate"
    }
  ],
  "resolution_summary": "string"
}
```

### Collection: `chat_logs`
```json
{
  "_id": "ObjectId",
  "user_id": "UUID (references users.id)",
  "channel": "string (WhatsApp, SMS, Telegram, Messenger)",
  "conversation_partner": "string (phone number / handle)",
  "messages": [
    {
      "sender": "string (partner, user)",
      "text": "string",
      "timestamp": "ISODate",
      "analyzed": "boolean",
      "scam_indicators": [
        {
          "keyword": "string",
          "nlp_class": "string (Urgency, FinancialCoercion, OTPRequest)",
          "score": "float"
        }
      ]
    }
  ],
  "scam_probability": "float"
}
```

---

## 3. Vector Database Schemas (Milvus / FAISS)
Vector databases store embeddings representing threat signatures, known scam messages, and brand assets for visual similarity searches.

### Index 1: `threat_intel_embeddings`
- **Fields**:
  - `vector`: Float32 Array (Dimensions: 1536 / 768)
  - `intel_id`: UUID
  - `description`: String (e.g. *"WhatsApp task scam offering 5000 INR for Youtube video likes"*)
  - `threat_type`: String (`scam_text`, `phishing_domain_pattern`, `payload_hash`)
  - `confidence_score`: Float
  - `date_ingested`: Timestamp

### Index 2: `brand_logos_embeddings`
- **Fields**:
  - `vector`: Float32 Array (Dimensions: 512 / 1024)
  - `brand_name`: String (e.g., *"HDFC Bank"*, *"Meta Platforms"*)
  - `visual_hash`: String
  - `safety_status`: String (`official_logo`)
