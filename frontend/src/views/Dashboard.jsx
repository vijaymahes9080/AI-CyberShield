import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Activity, Bell, Check, HelpCircle } from 'lucide-react';
import SecurityAssistant from '../components/SecurityAssistant';

const Dashboard = ({ activeAlerts, resolveAlert }) => {
  const [tickerIndex, setTickerIndex] = useState(0);
  const tickers = [
    "NEW: Phishing domain 'sbi-update-card.com' blocked globally by Threat Intel Agent.",
    "WARN: Identity exposure leak from 'LinkedIn 2024 Combo List' checked.",
    "INFO: Active robocall clone footprints updated: 14 new synthetic voice models blacklisted.",
    "SAFE: Device trust checks synced for vijay-desktop OS (Score: 95%)."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickers.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const severityColor = (sev) => {
    switch(sev.toUpperCase()) {
      case 'CRITICAL': return 'var(--cyber-red)';
      case 'HIGH': return 'var(--cyber-orange)';
      default: return 'var(--cyber-blue)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Top Welcome Title & Threat Ticker */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>AI CyberShield Control Center</h1>
          <p style={{ marginTop: '6px' }}>Detect • Verify • Prevent • Protect — Operating System active.</p>
        </div>
        <div className="glass-panel" style={{ 
          padding: '10px 20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          borderLeft: '4px solid var(--cyber-blue)',
          borderRadius: '8px',
          maxWidth: '450px'
        }}>
          <Activity size={16} className="pulse-glow" color="var(--cyber-blue)" />
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {tickers[tickerIndex]}
          </span>
        </div>
      </div>

      {/* Trust Gauges and Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        
        {/* Core Security Score Gauge */}
        <div className="glass-panel" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Security Index</h3>
          <div className="gauge-container" style={{ margin: '20px auto' }}>
            <svg className="gauge-svg" width="160" height="160" viewBox="0 0 160 160">
              <circle className="gauge-circle-bg" cx="80" cy="80" r="70" />
              <circle 
                className="gauge-circle-val" 
                cx="80" 
                cy="80" 
                r="70" 
                stroke="var(--cyber-blue)"
                strokeDasharray="440"
                strokeDashoffset="44" // 90%
              />
            </svg>
            <div className="gauge-value">
              <div className="gauge-number">90</div>
              <div className="gauge-label">Secure</div>
            </div>
          </div>
          <p style={{ fontSize: '0.78rem' }}>10 Agents active. Sync completed 2s ago.</p>
        </div>

        {/* Protection Health Status */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Environment Health</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={20} color="var(--cyber-green)" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Web Shield</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Active extensions: 3 browsers protected</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={20} color="var(--cyber-green)" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Mobile Sandbox</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>UPI intercept active, WhatsApp hook ready</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={20} color="var(--cyber-green)" />
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Zero Trust Sync</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cloud identities and leak checkers synced</div>
            </div>
          </div>
        </div>

        {/* Shield Licensing Summary */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '14px' }}>Tenant Profile</h3>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 'bold' }}>Premium Family Guard</div>
              <p style={{ fontSize: '0.74rem', marginTop: '4px' }}>Access: SMS scanner, synthetic voice cloner filter, darknet scanner.</p>
            </div>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span>Devices: 4 / 5</span>
            <span style={{ color: 'var(--cyber-blue)', cursor: 'pointer' }}>Manage Subscription</span>
          </div>
        </div>

      </div>

      {/* Active Incidents Alert Center */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--cyber-orange)" /> Active Incidents & Alerts
          </h2>
          <span className="badge badge-suspicious">{activeAlerts.length} Unresolved</span>
        </div>

        {activeAlerts.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <ShieldCheck size={40} color="var(--cyber-green)" style={{ marginBottom: '10px' }} />
            <p>No active threats identified. Your environment is secure.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeAlerts.map((alert) => (
              <div key={alert.id} style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--border-color)', 
                padding: '16px', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: `4px solid ${severityColor(alert.severity)}`
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 'bold', textTransform: 'uppercase', color: severityColor(alert.severity) }}>
                      [{alert.source}]
                    </span>
                    <h4 style={{ fontSize: '0.95rem', color: '#fff' }}>{alert.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.84rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                    {alert.description}
                  </p>
                </div>
                <button 
                  onClick={() => resolveAlert(alert.id)}
                  style={{
                    background: 'rgba(0, 255, 102, 0.1)',
                    border: '1px solid var(--cyber-green)',
                    color: 'var(--cyber-green)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => { e.target.style.background = 'var(--cyber-green)'; e.target.style.color = '#000'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'rgba(0, 255, 102, 0.1)'; e.target.style.color = 'var(--cyber-green)'; }}
                >
                  <Check size={14} /> Mark Resolved
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI CyberShield Security Assistant Section */}
      <div className="glass-panel">
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem' }}>AI Coprocessor Assistant</h2>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Type commands directly or copy scam logs to analyze with our AI agent orchestrator.</p>
        </div>
        <SecurityAssistant />
      </div>

    </div>
  );
};

export default Dashboard;
