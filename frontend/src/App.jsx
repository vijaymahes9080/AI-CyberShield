import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import AgentVisualizer from './components/AgentVisualizer';

// Import Views
import Dashboard from './views/Dashboard';
import FraudEngine from './views/FraudEngine';
import WebsiteChecker from './views/WebsiteChecker';
import WhatsAppDetector from './views/WhatsAppDetector';
import DeepfakeDetector from './views/DeepfakeDetector';
import CallProtection from './views/CallProtection';
import EmailSecurity from './views/EmailSecurity';
import IdentityMonitor from './views/IdentityMonitor';
import SocialProtection from './views/SocialProtection';
import DeviceSecurity from './views/DeviceSecurity';

function App() {
  const [currentView, setView] = useState('dashboard');
  const [activeAlerts, setActiveAlerts] = useState([]);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/alerts');
      const data = await response.json();
      // Only keep UNRESOLVED alerts
      const unresolved = data.filter(alert => alert.status === 'UNRESOLVED');
      setActiveAlerts(unresolved);
    } catch (err) {
      console.error("Failed to fetch alerts from backend server:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Periodically sync alerts
    const interval = setInterval(fetchAlerts, 8000);
    return () => clearInterval(interval);
  }, []);

  const resolveAlert = async (alertId) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      fetchAlerts();
    } catch (err) {
      console.error("Failed to resolve alert:", err);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard activeAlerts={activeAlerts} resolveAlert={resolveAlert} />;
      case 'fraud':
        return <FraudEngine addAlert={fetchAlerts} />;
      case 'website':
        return <WebsiteChecker addAlert={fetchAlerts} />;
      case 'whatsapp':
        return <WhatsAppDetector addAlert={fetchAlerts} />;
      case 'deepfake':
        return <DeepfakeDetector addAlert={fetchAlerts} />;
      case 'call':
        return <CallProtection />;
      case 'email':
        return <EmailSecurity />;
      case 'identity':
        return <IdentityMonitor />;
      case 'social':
        return <SocialProtection />;
      case 'device':
        return <DeviceSecurity />;
      case 'orchestrator':
        return <AgentVisualizer />;
      default:
        return <Dashboard activeAlerts={activeAlerts} resolveAlert={resolveAlert} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        currentView={currentView} 
        setView={setView} 
        alertsCount={activeAlerts.length} 
      />
      <div className="main-content">
        {renderView()}
      </div>
    </div>
  );
}

export default App;
