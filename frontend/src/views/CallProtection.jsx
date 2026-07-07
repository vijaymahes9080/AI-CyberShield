import React, { useState } from 'react';
import { Phone, ShieldAlert, ShieldCheck, Volume2 } from 'lucide-react';

const CallProtection = () => {
  const [voiceFilter, setVoiceFilter] = useState(true);
  const [autoBlock, setAutoBlock] = useState(true);

  const blockHistory = [
    { number: '+1 (800) 231-1981', caller: 'Scam IRS Support', date: 'Today, 14:10', reason: 'Robocall Voice Fingerprint match' },
    { number: '+91 98273-61192', caller: 'Unverified Investment Advisor', date: 'Yesterday, 18:32', reason: 'High urgency behavioral speech mismatch' },
    { number: '+1 (888) 123-4567', caller: 'Bank Refund Dept (Voice Cloned)', date: 'June 22, 11:05', reason: 'AI Speech Synthesis matching ElevenLabs' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>AI Call Protection</h1>
        <p style={{ marginTop: '6px' }}>Shield your devices from voice clones, robocalls, and caller ID spoofing networks.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }}>
        
        {/* Toggle Panel & Active wave */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
              Protection Controls
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff' }}>Voice Clone Interception Filter</h4>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Analyze voice harmonics in real-time. Divert cloned speech to sandbox.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={voiceFilter} 
                  onChange={(e) => setVoiceFilter(e.target.checked)} 
                  style={{ width: '38px', height: '20px', accentColor: 'var(--cyber-blue)', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontSize: '0.9rem', color: '#fff' }}>Auto Block Suspicious Robocalls</h4>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Instantly block numbers with negative caller reputation index.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoBlock} 
                  onChange={(e) => setAutoBlock(e.target.checked)} 
                  style={{ width: '38px', height: '20px', accentColor: 'var(--cyber-blue)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Active Audio Wave Graphic */}
          <div style={{ margin: '24px 0', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>LIVE AUDIO CLONE DETECTOR FEED</span>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', height: '50px', marginTop: '10px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <span 
                  key={i} 
                  style={{ 
                    width: '3px', 
                    height: '24px', 
                    background: 'var(--cyber-blue)',
                    borderRadius: '2px',
                    animation: `pulseHeight ${0.5 + i*0.1}s infinite ease-in-out`
                  }}
                ></span>
              ))}
            </div>
          </div>
        </div>

        {/* History Log panel */}
        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            Call Block History Ledger
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {blockHistory.map((item, index) => (
              <div key={index} style={{ 
                background: 'rgba(255,255,255,0.01)', 
                border: '1px solid var(--border-color)', 
                padding: '14px', 
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Volume2 size={16} color="var(--cyber-red)" />
                    <span style={{ fontSize: '0.86rem', fontWeight: 'bold', color: '#fff' }}>{item.caller}</span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.date}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                  Number: <code style={{ fontFamily: 'var(--font-mono)' }}>{item.number}</code>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--cyber-red)', marginTop: '4px' }}>
                  Reason: {item.reason}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulseHeight {
          0%, 100% { height: 8px; }
          50% { height: 35px; }
        }
      `}</style>

    </div>
  );
};

export default CallProtection;
