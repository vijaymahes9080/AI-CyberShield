import React from 'react';
import { 
  Shield, 
  Lock, 
  Link, 
  MessageSquare, 
  Video, 
  Phone, 
  Mail, 
  UserCheck, 
  Globe, 
  Cpu, 
  Laptop,
  AlertTriangle
} from 'lucide-react';

const Sidebar = ({ currentView, setView, alertsCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Safety Dashboard', icon: Shield, badge: 'Active' },
    { id: 'fraud', label: 'Fraud Engine', icon: Lock },
    { id: 'website', label: 'Fake Website Checker', icon: Link },
    { id: 'whatsapp', label: 'WhatsApp Detector', icon: MessageSquare },
    { id: 'deepfake', label: 'Deepfake Analyzer', icon: Video },
    { id: 'call', label: 'AI Call Protection', icon: Phone },
    { id: 'email', label: 'Email Security', icon: Mail },
    { id: 'identity', label: 'Identity Monitor', icon: UserCheck },
    { id: 'social', label: 'Social Protection', icon: Globe },
    { id: 'device', label: 'Device Security', icon: Laptop },
    { id: 'orchestrator', label: 'Agent Orchestrator', icon: Cpu, badge: '10 active' }
  ];

  return (
    <div className="sidebar">
      <div style={{ 
        padding: '30px 24px', 
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--cyber-blue) 0%, rgba(0,240,255,0.2) 100%)',
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.3)'
        }}>
          <Shield size={22} color="#06060c" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.05em' }}>
            CYBER<span style={{ color: 'var(--cyber-blue)' }}>SHIELD</span>
          </h2>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            AI Operating System
          </p>
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 0', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setView(item.id)}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span className="badge badge-safe" style={{ fontSize: '0.65rem' }}>
                  {item.badge}
                </span>
              )}
              {item.id === 'dashboard' && alertsCount > 0 && (
                <span className="badge badge-dangerous" style={{ padding: '2px 6px', borderRadius: '50%' }}>
                  {alertsCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ 
        padding: '20px 24px', 
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-mono)'
      }}>
        SYSTEM: ONLINE<br />
        IP: 127.0.0.1<br />
        SECURE THREADS: 10/10
      </div>
    </div>
  );
};

export default Sidebar;
