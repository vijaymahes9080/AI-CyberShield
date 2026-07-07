import unittest
from fastapi.testclient import TestClient
import sys
import os

# Adjust import path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app
from database import Base, engine

class TestCyberShieldAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create database tables
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

    def test_health(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_alerts(self):
        response = self.client.get("/api/alerts")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()) >= 3)

    def test_fraud_engine(self):
        payload = {
            "amount": 50000.0,
            "currency": "INR",
            "method": "UPI",
            "receiver_identifier": "scamster99@paytm",
            "behavior_metadata": {
                "call_active_during_tx": True,
                "screen_sharing_active": True,
                "urgency_timer_seen": True
              }
        }
        response = self.client.post("/api/fraud/score", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "BLOCKED")
        self.assertGreaterEqual(data["fraud_score"], 80)
        self.assertEqual(data["risk_level"], "DANGEROUS")

    def test_phishing_scanner(self):
        payload = {
            "url": "http://hdfc-netbanking-login-auth.cc/index.php"
        }
        response = self.client.post("/api/threat/url/scan", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "dangerous")
        self.assertTrue(any("HDFC" in ind for ind in data["indicators"]))

    def test_chat_scanner(self):
        payload = {
            "channel": "WhatsApp",
            "conversation_partner": "+9188127390",
            "messages": [
                {"sender": "partner", "text": "Win 10000 INR rewards by subscribing to Youtube likes!"},
                {"sender": "partner", "text": "Please provide your bank details and mobile OTP code immediately."}
            ]
        }
        response = self.client.post("/api/threat/chat/scan", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["risk_level"], "CRITICAL")
        self.assertTrue(data["scam_probability"] > 0.8)

    def test_agent_orchestrator(self):
        payload = {
            "message": "I received this Netflix email link: netflix-update-card.com. Is this safe?",
            "session_id": "test_session"
        }
        response = self.client.post("/api/agent/chat", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(len(data["orchestrator_log"]) > 0)
        self.assertTrue("netflix" in data["response"].lower() or "inspector" in data["response"].lower() or "dangerous" in data["response"].lower())

    def test_identity_breach(self):
        response = self.client.get("/api/identity/leak-lookup?email=vijay@gmail.com")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["health_score"], 40)
        self.assertTrue(len(data["breaches"]) > 0)

if __name__ == "__main__":
    unittest.main()
