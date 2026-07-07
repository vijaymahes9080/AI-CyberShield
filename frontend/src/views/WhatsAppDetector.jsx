import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';

const WhatsAppDetector = ({ addAlert }) => {
  const [messages, setMessages] = useState([
    { sender: 'partner', text: 'Hello, you have been selected for a part-time job from home!' },
    { sender: 'partner', text: 'Earn 5000 INR daily just for liking Youtube videos. To start, send me your mobile number and OTP code.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const testScams = [
    {
      label: 'Job Scam',
      msgs: [
        { sender: 'partner', text: 'Hello, I am a HR manager from Amazon.' },
        { sender: 'partner', text: 'We offer flexible part-time positions. Subscribing to Youtube channels pays 500 INR instantly. Are you interested?' }
      ]
    },
    {
      label: 'OTP Coercion',
      msgs: [
        { sender: 'partner', text: 'Your package delivery address is incomplete. Please confirm.' },
        { sender: 'partner', text: 'I am sending a verification code to your SMS. Read me the 6 digits immediately so I can release the order.' }
      ]
    },
    {
      label: 'Genuine Chat',
      msgs: [
        { sender: 'user', text: 'Hi Mom, are you free to chat tonight?' },
        { sender: 'partner', text: 'Yes dear, I will call you around 7 PM after I finish cooking. Talk to you then!' }
      ]
    }
  ];

  const handleScan = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/threat/chat/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'WhatsApp',
          conversation_partner: '+1982736184',
          messages: messages
        })
      });
      const data = await response.json();
      setResult(data);
      if (data.risk_level === 'CRITICAL' || data.risk_level === 'SUSPICIOUS') {
        addAlert();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend server. Make sure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMessage = (sender) => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { sender, text: inputText }]);
    setInputText('');
  };

  const loadTemplate = (msgs) => {
    setMessages(msgs);
    setResult(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>WhatsApp Scam Detector</h1>
        <p style={{ marginTop: '6px' }}>Scan incoming message sequences for OTP coercion, job recruitment scams, and social engineering patterns.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '30px' }}>
        
        {/* Chat box Simulator */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Simulated Chat Feed</h3>
              <button 
                onClick={() => { setMessages([]); setResult(null); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.74rem' }}
              >
                Clear History
              </button>
            </div>

            {/* Template Selector */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {testScams.map((ts, idx) => (
                <button
                  key={idx}
                  onClick={() => loadTemplate(ts.msgs)}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.74rem',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Load {ts.label}
                </button>
              ))}
            </div>

            {/* Message bubbles */}
            <div style={{ 
              background: '#040408', 
              border: '1px solid var(--border-color)', 
              borderRadius: '8px', 
              padding: '16px', 
              height: '240px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px',
              marginBottom: '16px'
            }}>
              {messages.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '60px' }}>
                  No messages loaded. Add a message or load a template.
                </div>
              ) : (
                messages.map((m, i) => (
                  <div key={i} style={{ 
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: m.sender === 'user' ? 'rgba(0,240,255,0.08)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-color)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    maxWidth: '85%',
                    fontSize: '0.86rem'
                  }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                      {m.sender === 'user' ? 'You' : 'Sender'}
                    </div>
                    {m.text}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            {/* Input Row */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
              <input
                type="text"
                className="cyber-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type dynamic chat statement here..."
              />
              <button 
                type="button" 
                className="btn-cyber" 
                style={{ padding: '0 16px', background: 'rgba(255,255,255,0.02)', borderColor: 'var(--border-color)', color: '#fff' }}
                onClick={() => handleAddMessage('partner')}
              >
                Add Sender
              </button>
              <button 
                type="button" 
                className="btn-cyber" 
                style={{ padding: '0 16px', background: 'rgba(255,255,255,0.02)', borderColor: 'var(--border-color)', color: '#fff' }}
                onClick={() => handleAddMessage('user')}
              >
                Add You
              </button>
            </div>

            <button 
              onClick={handleScan} 
              className="btn-cyber" 
              style={{ width: '100%' }}
              disabled={loading || messages.length === 0}
            >
              {loading ? 'Running Semantic NLP Check...' : 'Scan Conversation Safety'}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="pulse-glow" style={{ width: '60px', height: '60px', border: '3px solid var(--cyber-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s infinite linear', margin: '0 auto 20px' }}></div>
              <h3>Analyzing text sequences...</h3>
              <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Scam Conversation Analyzer evaluating coercion indexes.</p>
            </div>
          )}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <MessageSquare size={40} style={{ marginBottom: '15px' }} />
              <h3>Awaiting Input</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Generate a dialogue stream or click a template, then trigger scanning.</p>
            </div>
          )}

          {!loading && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Scam Probability</h3>
                <div style={{ 
                  fontSize: '4.5rem', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 900, 
                  color: result.risk_level === 'LOW' ? 'var(--cyber-green)' : result.risk_level === 'SUSPICIOUS' ? 'var(--cyber-orange)' : 'var(--cyber-red)',
                  lineHeight: '1.1',
                  margin: '10px 0'
                }}>
                  {int(result.scam_probability * 100)}%
                </div>
                <span className={`badge ${result.risk_level === 'LOW' ? 'badge-safe' : result.risk_level === 'SUSPICIOUS' ? 'badge-suspicious' : 'badge-dangerous'}`} style={{ fontSize: '0.85rem', padding: '4px 14px' }}>
                  {result.risk_level} — {result.category}
                </span>
              </div>

              {/* Red Flags Card */}
              {result.detected_red_flags.length > 0 && (
                <div style={{ background: 'rgba(255, 51, 102, 0.03)', border: '1px solid rgba(255, 51, 102, 0.15)', borderRadius: '8px', padding: '16px' }}>
                  <h4 style={{ color: 'var(--cyber-red)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <AlertTriangle size={14} /> Scam Red Flags Flagged:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {result.detected_red_flags.map((flag, index) => (
                      <div key={index} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        • {flag}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation Card */}
              <div style={{ background: 'rgba(0, 240, 255, 0.02)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '8px', fontSize: '0.84rem' }}>
                <h4 style={{ color: '#fff', marginBottom: '4px' }}>AI Agent Explanation:</h4>
                <p>{result.agent_explanation}</p>
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

// Quick helper
const int = (val) => Math.round(val);

export default WhatsAppDetector;
