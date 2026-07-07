import React, { useState } from 'react';
import { Link, ShieldAlert, ShieldCheck, Check, AlertTriangle } from 'lucide-react';

const WebsiteChecker = ({ addAlert }) => {
  const [url, setUrl] = useState('https://hdfc-netbanking-login-secure.in/login.php');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const presets = [
    { label: 'Official HDFC Bank', url: 'https://www.hdfcbank.com' },
    { label: 'Spoofed Netflix login', url: 'http://netflix-billing-update-card.cc/login' },
    { label: 'Suspicious dynamic domain', url: 'http://free-lottery-claims-2026.zip' }
  ];

  const handleScan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/threat/url/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
      });
      const data = await response.json();
      setResult(data);
      if (data.status === 'dangerous' || data.status === 'suspicious') {
        addAlert();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to backend server. Make sure FastAPI is running.');
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'dangerous': return 'badge-dangerous';
      case 'suspicious': return 'badge-suspicious';
      default: return 'badge-safe';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>Fake Website Checker</h1>
        <p style={{ marginTop: '6px' }}>Scan domains for typosquatting, brand spoofing, and malicious redirects using behavioral signature indexes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Form scan card */}
        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
            Domain Verification Scan
          </h3>

          <form onSubmit={handleScan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Website URL / Domain Name
              </label>
              <input 
                type="text" 
                className="cyber-input" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                required 
                placeholder="Enter URL to inspect"
              />
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Scan templates:</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {presets.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setUrl(p.url)}
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
              {loading ? 'Executing Inspections...' : 'Inspect Website Safety'}
            </button>
          </form>

          {/* Educational Guidelines */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <h4 style={{ color: '#fff', marginBottom: '8px' }}>Security Checks Executed:</h4>
            <ul style={{ listStyleType: 'circle', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>WHOIS records:</strong> checks registration dates under 5 days old.</li>
              <li><strong>Certificate paths:</strong> verifies SSL issuer legitimacy.</li>
              <li><strong>Branding typo matching:</strong> parses visual typosquatting.</li>
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="pulse-glow" style={{ width: '60px', height: '60px', border: '3px solid var(--cyber-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s infinite linear', margin: '0 auto 20px' }}></div>
              <h3>Analyzing SSL and Domain metadata...</h3>
              <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Threat Intel and Website Inspector agents running queries.</p>
            </div>
          )}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Link size={40} style={{ marginBottom: '15px' }} />
              <h3>Awaiting Input</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Enter a URL or click one of the presets to perform real-time verification.</p>
            </div>
          )}

          {!loading && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Verdict</h3>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 800, 
                  color: result.status === 'safe' ? 'var(--cyber-green)' : result.status === 'suspicious' ? 'var(--cyber-orange)' : 'var(--cyber-red)',
                  margin: '10px 0'
                }}>
                  {result.verdict}
                </div>
                <span className={`badge ${statusBadge(result.status)}`} style={{ fontSize: '0.82rem', padding: '4px 14px' }}>
                  Risk Score: {result.risk_score}%
                </span>
              </div>

              {/* Attributes Checklist */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Domain Age:</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>
                      {result.domain_age_days} Days
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>SSL Certificate:</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: result.ssl_valid ? 'var(--cyber-green)' : 'var(--cyber-red)', marginTop: '2px' }}>
                      {result.ssl_valid ? 'VALID CERT' : 'NO SSL / INVALID'}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.84rem', color: '#fff', marginBottom: '8px' }}>Security Indicators:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {result.indicators.map((ind, index) => (
                      <div key={index} style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {result.status === 'safe' ? (
                          <Check size={12} color="var(--cyber-green)" />
                        ) : (
                          <AlertTriangle size={12} color={result.status === 'suspicious' ? 'var(--cyber-orange)' : 'var(--cyber-red)'} />
                        )}
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(0, 240, 255, 0.03)', border: '1px solid rgba(0, 240, 255, 0.15)', padding: '14px', borderRadius: '8px', fontSize: '0.82rem' }}>
                <h4 style={{ color: '#fff', marginBottom: '4px' }}>Behavioral Explanation:</h4>
                <p>{result.explanation}</p>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default WebsiteChecker;
