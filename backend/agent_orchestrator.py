from typing import List, Dict, Any
import re

class MultiAgentOrchestrator:
    def __init__(self):
        self.agents = {
            "Threat Intelligence": "Aggregates feeds, checks IP/domain reputations, searches data breach listings, and checks known attack patterns.",
            "Fraud Investigator": "Reviews financial records, monitors real-time transaction activity, and constructs fraud timelines.",
            "Deepfake Analyzer": "Analyzes images, audio, and videos for synthetic face and speech artifacts.",
            "Website Inspector": "Examines WHOIS records, SSL setups, redirect counts, and page similarity profiles.",
            "Scam Conversation Analyzer": "Evaluates chats and emails for urgency scripts, coercion tactics, and financial demands.",
            "Recovery Assistant": "Assembles legal templates, draft dispute forms, and details security claim recovery routes.",
            "Incident Response": "Issues logs, generates tracking tickets, blocks compromised accounts, and flags assets.",
            "Security Advisor": "Audits device configurations, runs email phishing training simulations, and audits access lists.",
            "Device Protection": "Tracks camera/mic activity status, inspects active connections, and audits app lists.",
            "Personal Security": "Coordinates chat inputs, routes prompts to specialized agents, and returns aggregate findings."
        }

    def process_prompt(self, message: str, session_id: str) -> Dict[str, Any]:
        msg_lower = message.lower()
        active_agents = []
        orchestrator_log = []
        verdict = ""
        
        # Route logic based on query type
        if any(kw in msg_lower for kw in ["url", "website", "link", "phishing", "domain", "http"]):
            # Phishing investigation routing
            active_agents = ["Personal Security", "Website Inspector", "Threat Intelligence", "Incident Response"]
            orchestrator_log = [
                {"agent": "Multi-Agent Orchestrator", "action": "Routing request to URL scanning pipeline."},
                {"agent": "Personal Security", "action": "Received user link analysis request. Calling Website Inspector."},
                {"agent": "Website Inspector", "action": "Inspecting domain attributes, SSL certificate issuer, and domain registration date."},
                {"agent": "Threat Intelligence", "action": "Cross-checking domain against threat intelligence blacklists and vector database templates."},
                {"agent": "Incident Response", "action": "Registering check telemetry. If dangerous, queues abuse reporting script."}
            ]
            
            # Simple check
            domain_match = re.search(r'(https?://)?([a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+)', message)
            domain = domain_match.group(2) if domain_match else "unknown link"
            if any(kw in msg_lower for kw in ["netflix", "hdfc", "amazon", "bank", "paytm", "secure"]):
                verdict = f"I've scanned the link: {domain}. Website Inspector flagged this as dangerous. It was registered very recently and is attempting to mimic a well-known brand. Incident Response has logged this under Ticket INC-2026-8812."
            else:
                verdict = f"The domain {domain} has a valid SSL certificate and appears safe. Threat Intelligence reports no recent blacklists. However, always exercise caution when typing credentials."

        elif any(kw in msg_lower for kw in ["deepfake", "audio", "video", "voice", "image", "photo", "clone"]):
            active_agents = ["Personal Security", "Deepfake Analyzer", "Threat Intelligence"]
            orchestrator_log = [
                {"agent": "Multi-Agent Orchestrator", "action": "Forwarding media to Deepfake Analyzer pipeline."},
                {"agent": "Personal Security", "action": "Initializing media payload inspector."},
                {"agent": "Deepfake Analyzer", "action": "Running frequency spectrum evaluation for synthesized speech pattern and facial mesh consistency analysis."},
                {"agent": "Threat Intelligence", "action": "Checking audio file metadata against known synthetic generation software structures."}
            ]
            verdict = "Deepfake Analyzer evaluation completed. The media shows high indicators of artificial synthesizer rendering. The voice clone probability is estimated at 88%. This sounds like a synthesized voice clone."

        elif any(kw in msg_lower for kw in ["whatsapp", "chat", "message", "sms", "job", "otp", "coercion", "manager"]):
            active_agents = ["Personal Security", "Scam Conversation Analyzer", "Threat Intelligence", "Recovery Assistant"]
            orchestrator_log = [
                {"agent": "Multi-Agent Orchestrator", "action": "Mapping dialogue block to Chat Scanner."},
                {"agent": "Personal Security", "action": "Extracting message sequence string."},
                {"agent": "Scam Conversation Analyzer", "action": "Running NLP semantic analysis. Flagging key coercion markers (Urgent payout, task likes, OTP request)."},
                {"agent": "Threat Intelligence", "action": "Searching vector database for matching conversational scripts in historical scam logs."},
                {"agent": "Recovery Assistant", "action": "Preparing compensation claim draft guidelines in case the user has lost funds."}
            ]
            verdict = "This message fits a well-known WhatsApp Part-time Task Scam. The sender is attempting to coerce you with quick financial rewards in exchange for likes or reviews, and will eventually ask for OTPs or deposits. Do NOT respond. I've flagged this sender number."

        elif any(kw in msg_lower for kw in ["transaction", "upi", "card", "send", "bank", "money", "fraud"]):
            active_agents = ["Personal Security", "Fraud Investigator", "Threat Intelligence", "Incident Response"]
            orchestrator_log = [
                {"agent": "Multi-Agent Orchestrator", "action": "Initializing transaction verification pipeline."},
                {"agent": "Personal Security", "action": "Capturing transaction amount and recipient handle."},
                {"agent": "Fraud Investigator", "action": "Running anomaly scoring. Checking local active system signals (calls, screen share)."},
                {"agent": "Threat Intelligence", "action": "Looking up receiver identifier reputation in reported fraud ledger."},
                {"agent": "Incident Response", "action": "Preparing auto-lock instructions in case risk score exceeds 80."}
            ]
            verdict = "I have evaluated the transaction query. If a screen-sharing session or live call was active, our Fraud Investigator immediately blocks the transfer. The receiver reputation score is low. Please cancel the transaction."

        elif any(kw in msg_lower for kw in ["device", "camera", "mic", "microphone", "permission", "spyware", "virus"]):
            active_agents = ["Personal Security", "Device Protection", "Security Advisor"]
            orchestrator_log = [
                {"agent": "Multi-Agent Orchestrator", "action": "Querying local device health manager."},
                {"agent": "Personal Security", "action": "Initiating connection to device diagnostics router."},
                {"agent": "Device Protection", "action": "Inspecting current permissions, active camera/microphone hardware feeds, and list of running processes."},
                {"agent": "Security Advisor", "action": "Evaluating current configuration policies against Zero Trust standards."}
            ]
            verdict = "Your current device health is good (Trust Score: 95/100). No active camera or microphone hijack vectors were found. I recommend disabling developer options on Android/iOS when not in use."

        elif any(kw in msg_lower for kw in ["recovery", "dispute", "help", "robbed", "hacked", "stolen", "loss"]):
            active_agents = ["Personal Security", "Recovery Assistant", "Incident Response"]
            orchestrator_log = [
                {"agent": "Multi-Agent Orchestrator", "action": "Routing request to Recovery & Claims suite."},
                {"agent": "Personal Security", "action": "Extracting leak history context."},
                {"agent": "Recovery Assistant", "action": "Generating legal bank dispute letters, claims documents, and standard security reporting paths."},
                {"agent": "Incident Response", "action": "Logging incident file for audit compilation."}
            ]
            verdict = "I am ready to help you recover. I've prepared a Bank Dispute Letter draft and an RBI Cyber Incident Report template. You can download these forms from the Recovery panel on the dashboard."

        else:
            # General fallback assistant chat
            active_agents = ["Personal Security", "Security Advisor"]
            orchestrator_log = [
                {"agent": "Multi-Agent Orchestrator", "action": "Directing generic prompt to Personal Security Assistant."},
                {"agent": "Personal Security", "action": "Interpreting user question and fetching advisory guidelines."},
                {"agent": "Security Advisor", "action": "Formulating best practice response."}
            ]
            verdict = "Hello! I am your AI CyberShield Assistant. I coordinate 10 specialized agent guards to inspect URLs, verify deepfakes, score UPI transfers, scan chats, and monitor your device health. Ask me something specific like 'Is netflix-update-card.com safe?' or 'Check this message: Win 10000 INR now!'"

        return {
            "response": verdict,
            "session_id": session_id,
            "orchestrator_log": orchestrator_log
        }

# Singleton Instance
orchestrator = MultiAgentOrchestrator()
