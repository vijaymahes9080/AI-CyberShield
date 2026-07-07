import React, { useState, useEffect } from 'react';
import { Cpu, Terminal, Eye, Lock, Link, MessageSquare, Video, Phone, Mail, UserCheck, Globe, Laptop, Shield } from 'lucide-react';

const AgentVisualizer = () => {
  const [selectedAgent, setSelectedAgent] = useState('Orchestrator');
  const [simulationLogs, setSimulationLogs] = useState([]);
  
  const agents = [
    { name: 'Threat Intelligence', icon: Shield, status: 'IDLE', role: 'Vector DB checks & blacklist intelligence queries', tools: 'FAISS Search, WHOIS DB, IP Blocklists' },
    { name: 'Fraud Investigator', icon: Lock, status: 'ACTIVE', role: 'Behavioral fraud detection & transaction check loops', tools: 'Random Forest Classifiers, Active Overlay Sensors' },
    { name: 'Deepfake Analyzer', icon: Video, status: 'IDLE', role: 'Heuristic video artifact and cloned sound verification', tools: 'Synthetic Audio Spectrum, ViT Image Mesh check' },
    { name: 'Website Inspector', icon: Link, status: 'ACTIVE', role: 'SSL verification, domain registration age & typo checkers', tools: 'WHOIS Extractor, SSL Cert Analyzer, Logo similarity' },
    { name: 'Scam Conversation Analyzer', icon: MessageSquare, status: 'IDLE', role: 'NLP semantic audits and coercion dialog patterns', tools: 'NLP sentiment matchers, Urgency check triggers' },
    { name: 'Recovery Assistant', icon: UserCheck, status: 'IDLE', role: 'Bank dispute and cyber fraud reports compiler', tools: 'PDF claim templaters, RBI Guideline indexes' },
    { name: 'Incident Response', icon: Terminal, status: 'ACTIVE', role: 'Logs security events and routes account lockdowns', tools: 'SQL Logger, SendAlert Hook, Abuse.ch API' },
    { name: 'Security Advisor', icon: Shield, status: 'IDLE', role: 'User profile security rating and warning reviews', tools: 'Zero Trust Config Audit, Phishing Simulator' },
    { name: 'Device Protection', icon: Laptop, status: 'IDLE', role: 'Active mic/camera telemetry tracking and process auditor', tools: 'OS Permission Auditor, Task Inspector' },
    { name: 'Personal Security', icon: Cpu, status: 'ACTIVE', role: 'Primary coordinator representing the user AI chat proxy', tools: 'Session Memory Router, Context Swappper' }
  ];

  // Populate mock logs on launch
  useEffect(() => {
    const defaultLogs = [
      '[16:40:02] ORCHESTRATOR: Boot sequence verified. 10 Security Agents operational.',
      '[16:40:03] PERSONAL_SECURITY: Session MEM-8812 started. User dashboard active.',
      '[16:40:05] DEVICE_PROTECTION: Telemetry sync completed. Device score = 95/100.',
      '[16:40:10] THREAT_INTEL: Downloaded global feed updates: 124 newly registered scam domains flagged.',
      '[16:40:24] FRAUD_INVESTIGATOR: Monitored 2 UPI transactions. Status: APPROVED (Risk = Low).'
    ];
    setSimulationLogs(defaultLogs);

    // Simulate logs in background
    const interval = setInterval(() => {
      const phrases = [
        'THREAT_INTEL: Checking vector database for recent email template matches.',
        'WEBSITE_INSPECTOR: Audited domain age of active SSL redirects.',
        'FRAUD_INVESTIGATOR: Checked screen-share overlays status (None active).',
        'DEVICE_PROTECTION: Sent device telemetry updates to local database.',
        'PERSONAL_SECURITY: Aggregating alert queues. 3 Unresolved items listed.',
        'INCIDENT_RESPONSE: Synced logs with PostgreSQL audits ledger.'
      ];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      const now = new Date();
      const timeStr = `[${now.toTimeString().split(' ')[0]}]`;
      setSimulationLogs(prev => [...prev.slice(-15), `${timeStr} ${randomPhrase}`]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>Multi-Agent Orchestrator</h1>
        <p style={{ marginTop: '8px' }}>
          Interact with the live state machine routing queries and telemetry across our 10 coordinate AI guards.
        </p>
      </div>

      {/* Orchestrator Center Graph */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '40px',
        position: 'relative',
        background: 'radial-gradient(circle at center, rgba(0, 240, 255, 0.03) 0%, rgba(6, 6, 12, 0.4) 100%)',
        overflow: 'hidden'
      }}>
        {/* Connection paths */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          border: '1px dashed rgba(0, 240, 255, 0.12)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} className="pulse-glow"></div>

        {/* Central Orchestrator Node */}
        <div 
          onClick={() => setSelectedAgent('Orchestrator')}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--bg-dark) 0%, #1c1c30 100%)',
            border: `2px solid ${selectedAgent === 'Orchestrator' ? 'var(--cyber-blue)' : 'rgba(255,255,255,0.1)'}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'pointer',
            boxShadow: selectedAgent === 'Orchestrator' ? '0 0 20px rgba(0, 240, 255, 0.25)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <Cpu size={32} color="var(--cyber-blue)" className="pulse-glow" />
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', marginTop: '6px', fontFamily: 'var(--font-display)' }}>
            COORDINATOR
          </span>
        </div>

        {/* Small surrounding visual lines */}
        <div style={{
          position: 'absolute',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '800px',
          gap: '20px',
          marginTop: '160px'
        }}>
          {agents.map((agent) => {
            const AgentIcon = agent.icon;
            const isSelected = selectedAgent === agent.name;
            return (
              <button
                key={agent.name}
                onClick={() => setSelectedAgent(agent.name)}
                style={{
                  background: 'rgba(15, 15, 30, 0.8)',
                  border: `1px solid ${isSelected ? 'var(--cyber-blue)' : 'var(--border-color)'}`,
                  color: isSelected ? 'var(--cyber-blue)' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-display)',
                  boxShadow: isSelected ? '0 0 10px rgba(0,240,255,0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: agent.status === 'ACTIVE' ? 'var(--cyber-blue)' : 'var(--text-muted)'
                }} className={agent.status === 'ACTIVE' ? 'pulse-glow' : ''}></span>
                <AgentIcon size={14} />
                {agent.name}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Info panel */}
        <div className="glass-panel">
          {selectedAgent === 'Orchestrator' ? (
            <div>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', color: 'var(--cyber-blue)' }}>
                Multi-Agent Coordinator
              </h3>
              <p style={{ marginTop: '16px' }}>
                The orchestrator is a central memory manager. It receives user telemetry and chat prompts, performs semantic parsing, and activates a sub-cluster of the 10 agents.
              </p>
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '8px' }}>Active Protocols:</h4>
                <ul style={{ listStyleType: 'square', paddingLeft: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <li>Auto routing based on context keywords</li>
                  <li>Shared memory context tracking (MongoDB)</li>
                  <li>Human-in-the-loop approval blocks</li>
                </ul>
              </div>
            </div>
          ) : (
            <div>
              {(() => {
                const info = agents.find(a => a.name === selectedAgent);
                return (
                  <div>
                    <h3 style={{ 
                      borderBottom: '1px solid var(--border-color)', 
                      paddingBottom: '12px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '10px',
                      color: 'var(--cyber-blue)'
                    }}>
                      {selectedAgent}
                    </h3>
                    <p style={{ marginTop: '16px', fontSize: '0.95rem' }}>
                      {info?.role}
                    </p>
                    <div style={{ marginTop: '20px' }}>
                      <h4 style={{ fontSize: '0.88rem', color: '#fff', marginBottom: '6px' }}>Configured Tools:</h4>
                      <code style={{ 
                        display: 'block', 
                        background: '#020204', 
                        padding: '10px 14px', 
                        borderRadius: '6px', 
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--cyber-green)',
                        fontSize: '0.82rem'
                      }}>
                        {info?.tools}
                      </code>
                    </div>
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:</span>
                      <span className={`badge ${info?.status === 'ACTIVE' ? 'badge-safe' : 'badge-suspicious'}`}>
                        {info?.status === 'ACTIVE' ? 'Running' : 'Standby'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Live log panel */}
        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="var(--cyber-blue)" /> Live Orchestration Bus
          </h3>
          <div className="terminal-log" style={{ marginTop: '16px', height: '220px' }}>
            {simulationLogs.map((log, index) => (
              <div key={index} className="terminal-line">
                <span className="terminal-prefix">&gt;</span>
                <span className={log.includes('FRAUD') ? 'terminal-success' : log.includes('THREAT') ? 'terminal-warn' : ''}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentVisualizer;
