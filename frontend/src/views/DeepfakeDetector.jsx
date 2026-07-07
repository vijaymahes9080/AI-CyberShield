import React, { useState } from 'react';
import { Video, ShieldCheck, AlertTriangle, Play, HelpCircle } from 'lucide-react';

const DeepfakeDetector = ({ addAlert }) => {
  const [fileType, setFileType] = useState('audio');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const mockFiles = {
    audio: [
      { name: 'voice_clone_emergency.wav', label: 'Emergency Voice Call (Synthesized)' },
      { name: 'normal_son_voicemail.mp3', label: 'Authentic Voicemail (Biological)' }
    ],
    video: [
      { name: 'ceo_announcement_fake.mp4', label: 'CEO Video Statement (Deepfaked)' },
      { name: 'corporate_hq_interview.mov', label: 'HQ Zoom Interview (Authentic)' }
    ]
  };

  const handleScan = async (filename) => {
    setLoading(true);
    setResult(null);

    // Form data mock upload
    const formData = new FormData();
    formData.append('file', new File([""], filename));

    try {
      const response = await fetch('http://127.0.0.1:8000/api/threat/deepfake/scan', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
      if (data.verdict === 'synthetic_clone_detected') {
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
        <h1>Deepfake Detection System</h1>
        <p style={{ marginTop: '6px' }}>Evaluate video files and audio calls against face-mesh indicators and voice clone profiles.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Input selection panel */}
        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
            Media Upload Verification
          </h3>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <button
              onClick={() => { setFileType('audio'); setResult(null); }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                background: fileType === 'audio' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${fileType === 'audio' ? 'var(--cyber-blue)' : 'var(--border-color)'}`,
                color: fileType === 'audio' ? 'var(--cyber-blue)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'var(--font-display)'
              }}
            >
              Audio Speech (.wav, .mp3)
            </button>
            <button
              onClick={() => { setFileType('video'); setResult(null); }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                background: fileType === 'video' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${fileType === 'video' ? 'var(--cyber-blue)' : 'var(--border-color)'}`,
                color: fileType === 'video' ? 'var(--cyber-blue)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'var(--font-display)'
              }}
            >
              Video / Image (.mp4, .png)
            </button>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '10px' }}>Select Simulated File:</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {mockFiles[fileType].map((f, i) => (
                <div 
                  key={i} 
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-color)',
                    padding: '14px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 600 }}>{f.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>{f.label}</div>
                  </div>
                  <button 
                    onClick={() => handleScan(f.name)}
                    className="btn-cyber" 
                    style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                    disabled={loading}
                  >
                    Analyze File
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Educational tip */}
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <h4 style={{ color: '#fff', marginBottom: '6px' }}>Detection Heuristics:</h4>
            <p>
              Our CNN neural filters trace eye reflection vectors, GAN boundaries, and lip-sync alignment offsets, while the audio spectrum engine detects phase cancellation artifacts consistent with AI synthesis engines.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="pulse-glow" style={{ width: '60px', height: '60px', border: '3px solid var(--cyber-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s infinite linear', margin: '0 auto 20px' }}></div>
              <h3>Running CNN and Spectral classifiers...</h3>
              <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Deepfake Analyzer agent inspecting speech profiles and eye alignment.</p>
            </div>
          )}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Video size={40} style={{ marginBottom: '15px' }} />
              <h3>Awaiting Input</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Select an audio or video template above and click Analyze File to run deep learning detectors.</p>
            </div>
          )}

          {!loading && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Authenticity Score</h3>
                <div style={{ 
                  fontSize: '4.5rem', 
                  fontFamily: 'var(--font-display)', 
                  fontWeight: 900, 
                  color: result.verdict === 'authentic_media' ? 'var(--cyber-green)' : 'var(--cyber-red)',
                  lineHeight: '1.1',
                  margin: '10px 0'
                }}>
                  {result.authenticity_score}%
                </div>
                <span className={`badge ${result.verdict === 'authentic_media' ? 'badge-safe' : 'badge-dangerous'}`} style={{ fontSize: '0.85rem', padding: '4px 14px' }}>
                  {result.verdict === 'authentic_media' ? 'Authentic Biological Record' : 'Neural Synthetic Clone Flagged'}
                </span>
              </div>

              {/* Spectral Anomalies Card */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.88rem', marginBottom: '8px' }}>Scanned Artifact Anomalies:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.anomalies.map((anom, index) => (
                    <div key={index} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {result.verdict === 'authentic_media' ? (
                        <ShieldCheck size={12} color="var(--cyber-green)" />
                      ) : (
                        <AlertTriangle size={12} color="var(--cyber-red)" />
                      )}
                      <span>{anom}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'rgba(0, 240, 255, 0.02)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', fontSize: '0.82rem', textAlign: 'center' }}>
                <strong>Filename Checked:</strong> <code style={{ fontFamily: 'var(--font-mono)' }}>{result.filename}</code>
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

export default DeepfakeDetector;
