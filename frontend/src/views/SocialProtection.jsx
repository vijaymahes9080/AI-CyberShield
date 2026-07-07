import React, { useState } from 'react';
import { Globe, ShieldCheck, AlertTriangle, MessageSquare, Trash } from 'lucide-react';

const SocialProtection = () => {
  const [monitoredAccounts, setMonitoredAccounts] = useState([
    { platform: 'LinkedIn', handle: 'Vijay Kumar (Architect)', status: 'SAFE', checks: 142 },
    { platform: 'X / Twitter', handle: '@vijay_kumar_real', status: 'CLONE FLAGGED', checks: 98 },
    { platform: 'Instagram', handle: '@vijay.architect', status: 'SAFE', checks: 231 }
  ]);

  const flaggedClones = [
    { 
      platform: 'X / Twitter', 
      handle: '@vijay_kumar_rea1', 
      type: 'Account Cloned Profile', 
      exposed: 'Uses official photo, bio description typosquatting, directing followers to crypto giveaway links.',
      status: 'TAKEDOWN QUEUED'
    },
    { 
      platform: 'Instagram', 
      handle: '@vijay.architect_bonus', 
      type: 'Giveaway Scam Page', 
      exposed: 'Directs users to cash reward lottery verification apps.',
      status: 'REPORTED'
    }
  ];

  const handleTakedown = (handle) => {
    alert(`Cease & Desist Takedown request dispatched back to platform safety abuse APIs for ${handle}.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>Social Media Protection</h1>
        <p style={{ marginTop: '6px' }}>Shield your brand identities and profile handles against social cloning and giveaway hijack schemes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '30px' }}>
        
        {/* Monitored accounts grid */}
        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            Monitored Corporate Handles
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {monitoredAccounts.map((ac, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid var(--border-color)', 
                  padding: '14px', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--cyber-blue)', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {ac.platform}
                  </span>
                  <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600, marginTop: '2px' }}>{ac.handle}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Scans Run: {ac.checks} audits completed.
                  </div>
                </div>
                <span className={`badge ${ac.status === 'SAFE' ? 'badge-safe' : 'badge-dangerous'}`}>
                  {ac.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clones Identified Panel */}
        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            Flagged Clone & Impersonations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {flaggedClones.map((c, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(255, 51, 102, 0.02)', 
                  border: '1px solid rgba(255, 51, 102, 0.12)', 
                  padding: '16px', 
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--cyber-red)' }}>
                      [{c.platform}] {c.type}
                    </span>
                    <h4 style={{ color: '#fff', fontSize: '0.9rem', marginTop: '2px' }}>{c.handle}</h4>
                  </div>
                  <span className="badge badge-suspicious" style={{ fontSize: '0.62rem' }}>
                    {c.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  {c.exposed}
                </p>
                <button
                  onClick={() => handleTakedown(c.handle)}
                  className="btn-cyber"
                  style={{ 
                    marginTop: '12px', 
                    padding: '6px 12px', 
                    fontSize: '0.72rem',
                    borderColor: 'var(--cyber-red)',
                    color: 'var(--cyber-red)',
                    background: 'none'
                  }}
                >
                  Request Legal Takedown
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SocialProtection;
