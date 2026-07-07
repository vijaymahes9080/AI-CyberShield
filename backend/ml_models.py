import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
import re

class FraudScoringEngine:
    def __init__(self):
        # Initialize synthetic dataset and train models
        self.model = RandomForestClassifier(n_estimators=50, random_state=42)
        self.anomaly_detector = IsolationForest(contamination=0.05, random_state=42)
        self._train_initial_models()
        
        # High-risk target registers
        self.reported_upi_handles = {
            "scamster99@paytm", "easyloan@ybl", "refunddept@okaxis", 
            "lotterywins@sbi", "doublemoney@upi", "cryptohelp@paytm"
        }

    def _train_initial_models(self):
        # Generate synthetic data for training the classifier
        # Features: [amount, method_encoded, screen_sharing, call_active, urgency_flag, target_reported]
        # method_encoded: 0=UPI, 1=NetBanking, 2=Card, 3=Crypto
        np.random.seed(42)
        n_samples = 1000
        
        amounts = np.random.exponential(scale=5000, size=n_samples)
        methods = np.random.randint(0, 4, size=n_samples)
        screen_sharing = np.random.choice([0, 1], size=n_samples, p=[0.9, 0.1])
        call_active = np.random.choice([0, 1], size=n_samples, p=[0.8, 0.2])
        urgency = np.random.choice([0, 1], size=n_samples, p=[0.85, 0.15])
        target_reported = np.random.choice([0, 1], size=n_samples, p=[0.95, 0.05])
        
        # Define logic for fraud label
        labels = []
        for i in range(n_samples):
            score = 0
            if screen_sharing[i] == 1: score += 40
            if call_active[i] == 1: score += 25
            if urgency[i] == 1: score += 15
            if target_reported[i] == 1: score += 50
            if amounts[i] > 20000: score += 10
            if methods[i] == 3: score += 15 # Crypto is higher risk
            
            # Label as fraud (1) if score exceeds threshold
            labels.append(1 if score >= 50 else 0)
            
        X = pd.DataFrame({
            "amount": amounts,
            "method": methods,
            "screen_sharing": screen_sharing,
            "call_active": call_active,
            "urgency": urgency,
            "target_reported": target_reported
        })
        y = np.array(labels)
        
        self.model.fit(X.values, y)
        self.anomaly_detector.fit(X.values)

    def calculate_score(self, amount: float, method: str, receiver: str, screen_sharing: bool, call_active: bool, urgency: bool) -> int:
        # Encode method
        method_map = {"UPI": 0, "NetBanking": 1, "Card": 2, "Crypto": 3}
        encoded_method = method_map.get(method, 0)
        
        target_reported = 1 if receiver.lower() in self.reported_upi_handles else 0
        
        # Predict probability
        features = np.array([[
            amount, 
            encoded_method, 
            1 if screen_sharing else 0, 
            1 if call_active else 0, 
            1 if urgency else 0,
            target_reported
        ]])
        
        prob = self.model.predict_proba(features)[0][1]
        score = int(prob * 100)
        
        # Adjust score for explicit rule triggers
        if target_reported:
            score = max(score, 90)
        if screen_sharing and call_active:
            score = max(score, 85)
            
        return score

    def check_behavior_anomalies(self, amount: float, method: str, screen_sharing: bool, call_active: bool) -> bool:
        method_map = {"UPI": 0, "NetBanking": 1, "Card": 2, "Crypto": 3}
        encoded_method = method_map.get(method, 0)
        
        features = np.array([[
            amount,
            encoded_method,
            1 if screen_sharing else 0,
            1 if call_active else 0,
            0, # urgency
            0  # target_reported
        ]])
        
        prediction = self.anomaly_detector.predict(features)
        return True if prediction[0] == -1 else False


class DomainReputationEngine:
    def __init__(self):
        self.suspicious_tlds = {".zip", ".mov", ".ru", ".cc", ".icu", ".top", ".click", ".work"}
        self.brand_keywords = ["hdfc", "netflix", "amazon", "sbi", "paypal", "meta", "google", "apple"]
        
    def analyze_domain(self, domain: str) -> dict:
        domain = domain.lower().strip()
        indicators = []
        risk_score = 10
        
        # Strip protocols and www
        clean_domain = re.sub(r'^(https?://)?(www\.)?', '', domain)
        base_part = clean_domain.split('/')[0]
        
        # Check TLD
        for tld in self.suspicious_tlds:
            if base_part.endswith(tld):
                risk_score += 25
                indicators.append(f"Suspicious top-level domain extension ({tld})")
                
        # Check brand typosquatting
        matched_brand = None
        for brand in self.brand_keywords:
            if brand in base_part and base_part != f"{brand}.com" and not base_part.endswith(f".{brand}.com"):
                matched_brand = brand
                risk_score += 45
                indicators.append(f"Contains brand keyword but is not official domain (Impersonates: {brand.upper()})")
                
        # Check length/entropy
        if len(base_part) > 25:
            risk_score += 15
            indicators.append("Unusually long domain name indicating dynamic generation")
            
        # Check character patterns (hyphens, double vowels, numbers)
        hyphen_count = base_part.count('-')
        if hyphen_count > 1:
            risk_score += 15
            indicators.append("Contains multiple hyphens, often used in phishing links")
            
        risk_score = min(100, risk_score)
        
        status = "safe"
        if risk_score > 70:
            status = "dangerous"
        elif risk_score > 35:
            status = "suspicious"
            
        # Mock additional criteria
        domain_age = 365
        if status == "dangerous":
            domain_age = np.random.randint(1, 10)
        elif status == "suspicious":
            domain_age = np.random.randint(10, 60)
            
        return {
            "status": status,
            "risk_score": risk_score,
            "indicators": indicators if indicators else ["No obvious malicious domain structures detected"],
            "domain_age_days": domain_age,
            "ssl_valid": True if status != "dangerous" else False
        }

# Instantiate engine Singletons
fraud_engine_ml = FraudScoringEngine()
domain_engine_ml = DomainReputationEngine()
