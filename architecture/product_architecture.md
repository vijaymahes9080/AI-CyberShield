# AI CyberShield — Product Architecture

AI CyberShield is a multi-tenant, cloud-native Digital Trust & Threat Intelligence Operating System. It provides a real-time security shield across digital environments for consumers, businesses, and government agencies.

---

## 1. System Topology & Flow

The application coordinates frontend interfaces (Browser/Desktop/Mobile), active threat interception vectors (email proxies, browser hooks, WhatsApp API gateways), a high-performance backend parser, and a multi-agent AI system.

```
[ Clients: Web App / Extension / Mobile ]
               │
               ▼ (HTTPS / WSS)
    [ API Gateway & CORS Shield ]
               │
       ┌───────┴────────────────────────┐
       ▼                                ▼
[ FastAPI Business Engine ]    [ FastAPI AI Agent Orchestrator ]
       │                                │
       ├──────────────┬─────────────────┤
       ▼              ▼                 ▼
[ SQLite / Postgres ] [ MongoDB ]  [ Vector Database / FAISS ]
(Relational Data)    (JSON Logs)   (Threat Knowledge Graph)
```

1. **Intake Layer**: Telemetry data (URLs, network activity, audio streams, text streams, email metadata) flows into the API Gateway.
2. **Synchronous Validation (ML Layer)**: High-speed statistical scoring models (Random Forest, Isolation Forest) execute immediately, calculating basic risk vectors (e.g. domain age, entropy, keyword matches) under 50ms.
3. **Asynchronous Verification (Agent Orchestrator)**: Incidents with suspicious scores are forwarded to the Multi-Agent Orchestrator. 10 specialized agents collaborate using semantic message routing to analyze files, parse conversational manipulation, trace darknet exposures, and formulate mitigation plans.
4. **Data Sync**: Incidents are saved to the document store (MongoDB) and relational databases (PostgreSQL), and cached via Redis. A Vector Database (FAISS/Milvus) is queried for recent patterns matching known threat campaigns.

---

## 2. User Journeys

### Individual & Family
- **Signup**: Single-sign-on (OAuth2) with automated email scan setup.
- **Onboarding**: Install Chrome extension, configure SMS/WhatsApp helper contact, and add family member devices.
- **Threat Mitigation**: User receives a push notification: *"Your grandmother received a call containing clone signatures of your voice. The call was automatically diverted to the sandbox."*
- **Recovery**: Individual accesses the AI Recovery Assistant to generate formal letters for banking disputes.

### Business & Enterprise
- **Deployment**: API keys generated for corporate email servers (Office365/GSuite) and Slack integrations.
- **Monitoring**: Security Operations Center (SOC) dashboard visualizes real-time phishing waves, identity leaks, and active client-side malware attempts on company endpoints.
- **Resolution**: Incident responders receive auto-generated playbooks and compliance-ready audit logs in PDF format.

---

## 3. Monetization Strategy

AI CyberShield operates on a hybrid SaaS model:

| Tier | Price / Month | Targeted Segment | Key Features |
| :--- | :--- | :--- | :--- |
| **Free (Shield Lite)** | $0 | Individuals / Students | Manual link scan, monthly exposure checks, basic WhatsApp checker (30 scans/mo). |
| **Premium Guard** | $9.99 | Individuals / Families | Live browser monitoring, Call clone alerts, unlimited WhatsApp scanning, Identity Health dashboard, 5-device sync. |
| **Business Shield** | $49.00 / seat | SMBs / Startups | GSuite/Outlook integrations, central logs dashboard, active social media clone checks, Team trust scores, 10-Agent SOC. |
| **Enterprise Trust** | Custom | Enterprises / Governments | Dedicated API keys, Zero-Trust network integration, customized compliance audits, customized threat vector ML models. |
| **Developer API** | Pay-as-you-go | Software Engineers | Real-time URL and Deepfake scoring endpoints ($0.005/scan). |

---

## 4. Product Roadmap

```
  Phase 1: Core Foundation (Months 1-3)
  ┌──────────────────────────────────────────────────────────┐
  │ Build FastAPI Threat Engine, Vite Dashboard UI,          │
  │ ML Risk Calculators, and local agent orchestration models.│
  └──────────────────────────────────────────────────────────┘
                            │
                            ▼
  Phase 2: Active Interceptors (Months 4-6)
  ┌──────────────────────────────────────────────────────────┐
  │ Launch browser extensions (Chrome, Safari), WhatsApp     │
  │ Webhook listeners, and automated IMAP/SMTP email scanners.│
  └──────────────────────────────────────────────────────────┘
                            │
                            ▼
  Phase 3: Deep AI & Scalability (Months 7-12)
  ┌──────────────────────────────────────────────────────────┐
  │ Deploy Graph Neural Networks (GNN) for Transaction Maps, │
  │ ViT models for live video deepfakes, and multi-cloud sync.│
  └──────────────────────────────────────────────────────────┘
```

---

## 5. Scaling Strategy (Without Docker)

To run the application efficiently across physical servers or standard VMs:
1. **Application Layer Isolation**: Host the FastAPI server on multiple Node servers managed by `PM2` or Windows Service wrappers. Use standard reverse proxies like `Nginx` or `IIS` to balance loads.
2. **Database Clustering**: Configure PostgreSQL read-replicas for read-heavy operations (e.g. checking logs, dashboard reads). Run MongoDB as a multi-node replica set to manage heavy unstructured chat log scanning.
3. **Caching Layer**: Implement a local or cluster Redis daemon to cache URL scanning results and transaction profile signatures. Safe URLs do not need to hit the AI model or Database twice, reducing verification latency from 150ms to 2ms.
4. **Edge CDN Execution**: Deploy HTML and assets globally via CDN (Cloudflare/AWS CloudFront) to handle static content requests, routing dynamic `/api` requests to application backends.
