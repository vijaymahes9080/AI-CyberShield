import React, { useState } from 'react';
import { UserCheck, ShieldAlert, ShieldCheck, HelpCircle } from 'lucide-react';

const IdentityMonitor = () => {
  const [email, setEmail] = useState('vijay@gmail.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    { label: 'Vijay Kumar (Leaked)', email: 'vijay@gmail.com' },
    { label: 'Clean Account', email: 'hello@cybershield.net' }
  ];

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/identity/leak-lookup?email=${email}`);
      const data = await response.json();
      setResult(data);
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
        <h1>Identity Exposure Monitor</h1>
        <p style={{ marginTop: '6px' }}>Audit credentials against darknet database combinations and public exposure vectors.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '30px' }}>
        
        {/* Form Lookup */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
              Exposure Scan Engine
            </h3>

            <form onSubmit={handleLookup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Target Email Address
                </label>
                <input 
                  type="email" 
                  className="cyber-input" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  placeholder="Enter email to scan"
                />
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Scan targets:</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {presets.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEmail(p.email)}
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
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-cyber" style={{ marginTop: '10px' }} disabled={loading}>
                {loading ? 'Searching Darknet Combination Logs...' : 'Search Breach Logs'}
              </button>
            </form>
          </div>

          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <h4 style={{ color: '#fff', marginBottom: '6px' }}>Exposure Vectors Checked:</h4>
            <ul style={{ listStyleType: 'square', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Dark web password dumps (Combo Lists)</li>
              <li>Exposed private keys & repositories</li>
              <li>Public phone number mapping registries</li>
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="pulse-glow" style={{ width: '60px', height: '60px', border: '3px solid var(--cyber-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s infinite linear', margin: '0 auto 20px' }}></div>
              <h3>Analyzing leak repositories...</h3>
              <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Threat Intel Agent querying combination tables.</p>
            </div>
          )}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <UserCheck size={40} style={{ marginBottom: '15px' }} />
              <h3>Awaiting Input</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Enter your email or select a template preset above and start audit scanning.</p>
            </div>
          )}

          {!loading && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Identity Health Score</h3>
                <div style={{ 
                  fontSize: '4.5rem', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 900, 
                  color: result.health_score >= 80 ? 'var(--cyber-green)' : result.health_score >= 50 ? 'var(--cyber-orange)' : 'var(--cyber-red)',
                  lineHeight: '1.1',
                  margin: '10px 0'
                }}>
                  {result.health_score}%
                </div>
                <span className={`badge ${result.health_score >= 80 ? 'badge-safe' : result.health_score >= 50 ? 'badge-suspicious' : 'badge-dangerous'}`} style={{ fontSize: '0.85rem', padding: '4px 14px' }}>
                  {result.health_score >= 80 ? 'EXPOSURE LOW' : result.health_score >= 50 ? 'SUSPICIOUS LEAKS' : 'CRITICAL EXPOSURE'}
                </span>
              </div>

              {/* Leak lists */}
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '10px' }}>Identified Leaks:</h4>
                {result.breaches.length === 0 ? (
                  <div style={{ 
                    background: 'rgba(0, 255, 102, 0.02)', 
                    border: '1px solid rgba(0, 255, 102, 0.12)', 
                    padding: '14px', 
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    color: 'var(--cyber-green)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <ShieldCheck size={16} /> No database compromises identified for this email.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.breaches.map((b, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          background: 'rgba(255,255,255,0.01)', 
                          border: '1px solid var(--border-color)', 
                          padding: '12px', 
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: 'bold', color: '#fff' }}>{b.source}</span>
                          <span className="badge badge-dangerous" style={{ fontSize: '0.62rem' }}>{b.risk} Risk</span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                          Exposed Info: {b.exposed}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Date Logged: {b.date}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommendation card */}
              <div style={{ background: 'rgba(0, 240, 255, 0.02)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '8px', fontSize: '0.84rem' }}>
                <h4 style={{ color: '#fff', marginBottom: '4px' }}>AI Advisor Guidelines:</h4>
                <p>{result.recommendation}</p>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default IdentityMonitor;
