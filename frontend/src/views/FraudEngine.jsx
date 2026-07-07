import React, { useState } from 'react';
import { Lock, ShieldAlert, ShieldCheck, Play, ArrowRight } from 'lucide-react';

const FraudEngine = ({ addAlert }) => {
  const [amount, setAmount] = useState('25000');
  const [method, setMethod] = useState('UPI');
  const [receiver, setReceiver] = useState('scamster99@paytm');
  const [callActive, setCallActive] = useState(true);
  const [screenShare, setScreenShare] = useState(true);
  const [urgency, setUrgency] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testRecipients = [
    { label: 'Vijay Kumar (Verified)', handle: 'vijay@okaxis' },
    { label: 'Blacklisted UPI (Reported)', handle: 'scamster99@paytm' },
    { label: 'Unverified Wallet', handle: 'cryptohelp@paytm' }
  ];

  const handleEvaluate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/fraud/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: 'INR',
          method: method,
          receiver_identifier: receiver,
          behavior_metadata: {
            call_active_during_tx: callActive,
            screen_sharing_active: screenShare,
            urgency_timer_seen: urgency
          }
        })
      });
      const data = await response.json();
      setResult(data);
      if (data.status === 'BLOCKED' || data.status === 'FLAGGED') {
        addAlert();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend server. Make sure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>AI Fraud Detection Engine</h1>
        <p style={{ marginTop: '6px' }}>Evaluate banking transfers and UPI transactions against behavioral anomalies and blacklists.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }}>
        
        {/* Form panel */}
        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
            Transaction Parameters
          </h3>

          <form onSubmit={handleEvaluate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Transfer Amount (INR)
              </label>
              <input 
                type="number" 
                className="cyber-input" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Method
                </label>
                <select 
                  className="cyber-input" 
                  value={method} 
                  onChange={(e) => setMethod(e.target.value)}
                  style={{ background: '#0c0c14' }}
                >
                  <option value="UPI">UPI Transfer</option>
                  <option value="NetBanking">Net Banking</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="Crypto">Crypto Wallet</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Receiver Identifier / UPI ID
                </label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={receiver} 
                  onChange={(e) => setReceiver(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Quick templates:</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {testRecipients.map((tr, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setReceiver(tr.handle)}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.74rem',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Behavioral Indicators Switch toggles */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '8px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: '#fff' }}>Behavioral Threat Telemetry</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input 
                    type="checkbox" 
                    checked={callActive} 
                    onChange={(e) => setCallActive(e.target.checked)} 
                    style={{ width: '16px', height: '16px', accentColor: 'var(--cyber-blue)' }} 
                  />
                  <span>Active Voice Call during payment (Potential scammer guidance)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input 
                    type="checkbox" 
                    checked={screenShare} 
                    onChange={(e) => setScreenShare(e.target.checked)} 
                    style={{ width: '16px', height: '16px', accentColor: 'var(--cyber-blue)' }} 
                  />
                  <span>Active Screen Share overlay (AnyDesk, TeamViewer active)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input 
                    type="checkbox" 
                    checked={urgency} 
                    onChange={(e) => setUrgency(e.target.checked)} 
                    style={{ width: '16px', height: '16px', accentColor: 'var(--cyber-blue)' }} 
                  />
                  <span>Urgency trigger seen (Scammer urging quick checkout)</span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-cyber" style={{ marginTop: '10px' }} disabled={loading}>
              {loading ? 'Analyzing Transactions...' : 'Evaluate Risk Score'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="pulse-glow" style={{ width: '60px', height: '60px', border: '3px solid var(--cyber-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s infinite linear', margin: '0 auto 20px' }}></div>
              <h3>AI Fraud Engine Scoring...</h3>
              <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Executing Random Forest decision trees on client behavioral indicators.</p>
            </div>
          )}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Lock size={40} style={{ marginBottom: '15px' }} />
              <h3>Awaiting Input</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Fill in payment amount and active telemetry indicators, then click Evaluate to run security models.</p>
            </div>
          )}

          {!loading && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Fraud Score</h3>
                <div style={{ 
                  fontSize: '4.5rem', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 900, 
                  color: result.status === 'APPROVED' ? 'var(--cyber-green)' : result.status === 'FLAGGED' ? 'var(--cyber-orange)' : 'var(--cyber-red)',
                  lineHeight: '1.1',
                  margin: '10px 0'
                }}>
                  {result.fraud_score}%
                </div>
                <span className={`badge ${result.status === 'APPROVED' ? 'badge-safe' : result.status === 'FLAGGED' ? 'badge-suspicious' : 'badge-dangerous'}`} style={{ fontSize: '0.85rem', padding: '4px 14px' }}>
                  {result.status}
                </span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '8px', fontSize: '0.88rem' }}>
                <h4 style={{ color: '#fff', marginBottom: '6px' }}>AI Verdict Explanation:</h4>
                <p style={{ fontSize: '0.84rem' }}>{result.explanation}</p>
              </div>

              {/* Transaction Event Timeline */}
              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: '#fff' }}>Incident Timeline Visual</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '2px solid rgba(255,255,255,0.06)', paddingLeft: '16px', marginLeft: '6px' }}>
                  {result.timeline.map((item, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <span style={{ 
                        position: 'absolute', 
                        left: '-22px', 
                        top: '4px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: index === result.timeline.length - 1 
                          ? (result.status === 'APPROVED' ? 'var(--cyber-green)' : 'var(--cyber-red)') 
                          : 'rgba(255,255,255,0.2)'
                      }}></span>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.time}</div>
                      <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: '2px' }}>{item.event}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  );
};

export default FraudEngine;
