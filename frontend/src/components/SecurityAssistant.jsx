import React, { useState } from 'react';
import { Send, Terminal, Cpu, HelpCircle, ShieldAlert } from 'lucide-react';

const SecurityAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'agent', text: "Hello! I am the Personal Security Coordinator. I orchestrate 10 specialized agent systems to scan links, verify files/images, audit transaction signals, and check chats. How can I protect you today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentLogs, setAgentLogs] = useState([
    { agent: 'Orchestrator', action: 'Personal Security Agent initialized on socket MEM-8812.' }
  ]);

  const quickCommands = [
    { label: 'Check Netflix Phishing Domain', text: 'Is netflix-billing-update-secure.com safe?' },
    { label: 'Check WhatsApp Task Job offer', text: 'Check WhatsApp offer: Part-time job paying 5000 INR from home for Youtube likes.' },
    { label: 'Check Voice Clone audio', text: 'Verify audio clone: I got a call from someone sounding like my son asking for emergency cash.' },
    { label: 'Verify device security status', text: 'Verify device camera permission safety.' }
  ];

  const handleSend = async (messageText) => {
    if (!messageText.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: messageText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, session_id: 'active_session' })
      });
      const data = await response.json();
      
      setMessages(prev => [...prev, { sender: 'agent', text: data.response }]);
      if (data.orchestrator_log) {
        setAgentLogs(data.orchestrator_log);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { sender: 'agent', text: "Failed to connect to the Agent Orchestrator backend. Please ensure the FastAPI server is running on localhost:8000." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', height: '620px' }}>
      
      {/* Chat Window Panel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
        <div style={{ 
          borderBottom: '1px solid var(--border-color)', 
          paddingBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Cpu color="var(--cyber-blue)" size={20} />
          <div>
            <h3 style={{ fontSize: '1.05rem', color: '#fff' }}>Personal Security Coordinator</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--cyber-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyber-green)' }}></span>
              Ready to verify
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages" style={{ flex: 1, padding: '16px 0' }}>
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.sender}`}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                {m.sender === 'user' ? 'You' : 'Coordinator'}
              </div>
              <div>{m.text}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble agent">
              <span className="pulse-glow" style={{ color: 'var(--cyber-blue)', fontFamily: 'var(--font-mono)' }}>
                [Orchestrator Routing Prompt...]
              </span>
            </div>
          )}
        </div>

        {/* Quick Suggestion buttons */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          {quickCommands.map((qc, i) => (
            <button
              key={i}
              onClick={() => handleSend(qc.text)}
              disabled={loading}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '0.74rem',
                padding: '6px 12px',
                borderRadius: '16px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = 'var(--cyber-blue)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'var(--border-color)'}
            >
              {qc.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            className="cyber-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder='Type security query, URL, or chat offer (e.g. "Check NetBanking URL")'
          />
          <button type="submit" className="btn-cyber" style={{ padding: '0 20px' }} disabled={loading}>
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Agent Coordination Timeline Panel */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={18} color="var(--cyber-blue)" /> Multi-Agent Steps
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '16px' }}>
          Review the orchestrator routing path and individual sub-agent verdicts in real-time.
        </p>

        <div className="terminal-log" style={{ flex: 1 }}>
          {agentLogs.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              No active agent logs. Submit a scan request.
            </div>
          ) : (
            agentLogs.map((log, index) => (
              <div key={index} className="terminal-line" style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '6px' }}>
                <div style={{ color: 'var(--cyber-blue)', fontWeight: 'bold', fontSize: '0.78rem', fontFamily: 'var(--font-display)' }}>
                  [{log.agent}]
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {log.action}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default SecurityAssistant;
