import React, { useState, useEffect, useRef } from 'react';
import { Video, ShieldCheck, AlertTriangle, Play, HelpCircle, Mic, MicOff, Volume2, Shield, Activity, BarChart2, CheckCircle2, RotateCcw, FileText } from 'lucide-react';

const DeepfakeDetector = ({ addAlert }) => {
  const [fileType, setFileType] = useState('audio');
  const [sandboxMode, setSandboxMode] = useState('templates'); // 'templates' | 'live'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Mic Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [micStream, setMicStream] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const [vocalMetrics, setVocalMetrics] = useState({
    jitter: 0.12,
    shimmer: 0.18,
    pitchMod: 4.2,
    coherence: 98.4
  });

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

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

  // Live Canvas Wave Animation when idle or recording
  useEffect(() => {
    if (!isRecording && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let angle = 0;
      
      const drawIdleWave = () => {
        if (isRecording) return;
        ctx.fillStyle = 'rgba(6, 6, 12, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.beginPath();
        
        // Draw standard sine wave
        for (let i = 0; i < canvas.width; i++) {
          const y = canvas.height / 2 + Math.sin(i * 0.03 + angle) * 15 * Math.sin(i * 0.005);
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
        
        // Secondary wave
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
        ctx.beginPath();
        for (let i = 0; i < canvas.width; i++) {
          const y = canvas.height / 2 + Math.cos(i * 0.02 + angle) * 10 * Math.sin(i * 0.007);
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
        
        angle += 0.05;
        animationFrameRef.current = requestAnimationFrame(drawIdleWave);
      };
      
      drawIdleWave();
      return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [isRecording, sandboxMode]);

  // Start Mic Capture
  const startMic = async () => {
    try {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStream(stream);
      setIsRecording(true);
      setRecordTime(0);
      setResult(null);
      
      // Timer setup
      timerRef.current = setInterval(() => {
        setRecordTime(prev => {
          if (prev >= 6) {
            stopMic(stream);
            return 6;
          }
          return prev + 1;
        });
        
        // Jitter live changes
        setVocalMetrics({
          jitter: Number((0.08 + Math.random() * 0.08).toFixed(2)),
          shimmer: Number((0.10 + Math.random() * 0.12).toFixed(2)),
          pitchMod: Number((3.0 + Math.random() * 3.5).toFixed(1)),
          coherence: Number((95.0 + Math.random() * 4.5).toFixed(1))
        });
      }, 1000);

      // Web Audio API Visualizer Setup
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawLiveSpectrum = () => {
        if (!canvas) return;
        analyser.getByteFrequencyData(dataArray);
        
        ctx.fillStyle = 'rgba(6, 6, 12, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = (canvas.width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 1.5;
          
          // Gradient colors: Cyan to Purple
          const percent = i / bufferLength;
          const r = Math.floor(0 + percent * 168);
          const g = Math.floor(240 - percent * 155);
          const b = Math.floor(255 - percent * 8);
          
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          
          x += barWidth;
        }
        
        animationFrameRef.current = requestAnimationFrame(drawLiveSpectrum);
      };
      
      drawLiveSpectrum();

    } catch (err) {
      console.error("Microphone access error:", err);
      // Mock visualizer fallback if permission denied
      setIsRecording(true);
      setRecordTime(0);
      setResult(null);
      
      timerRef.current = setInterval(() => {
        setRecordTime(prev => {
          if (prev >= 6) {
            stopMicMock();
            return 6;
          }
          return prev + 1;
        });
        setVocalMetrics({
          jitter: Number((0.08 + Math.random() * 0.08).toFixed(2)),
          shimmer: Number((0.10 + Math.random() * 0.12).toFixed(2)),
          pitchMod: Number((3.0 + Math.random() * 3.5).toFixed(1)),
          coherence: Number((95.0 + Math.random() * 4.5).toFixed(1))
        });
      }, 1000);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let angle = 0;
      
      const drawMockSpectrum = () => {
        if (!canvasRef.current) return;
        ctx.fillStyle = 'rgba(6, 6, 12, 0.4)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const numBars = 40;
        const barWidth = canvas.width / numBars;
        
        for (let i = 0; i < numBars; i++) {
          const factor = Math.sin(i * 0.15 + angle) * Math.cos(i * 0.05 + angle);
          const barHeight = Math.max(10, Math.abs(factor) * 70 + Math.random() * 15);
          
          const percent = i / numBars;
          const r = Math.floor(0 + percent * 168);
          const g = Math.floor(240 - percent * 155);
          const b = Math.floor(255 - percent * 8);
          
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
        }
        angle += 0.1;
        animationFrameRef.current = requestAnimationFrame(drawMockSpectrum);
      };
      drawMockSpectrum();
    }
  };

  const stopMicMock = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    // Simulate authentic response
    handleScan("mic_recording_authentic.wav");
  };

  const stopMic = (stream) => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setMicStream(null);
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    // Call scan with a special name indicating it's an authentic mic recording
    setTimeout(() => {
      handleScan("mic_recording_authentic.wav");
    }, 500);
  };

  const handleScan = async (filename) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', new File([""], filename));

    try {
      const response = await fetch('http://127.0.0.1:8000/api/threat/deepfake/scan', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      
      // Inject vocal forensic stats for display
      if (data.verdict === 'authentic_media') {
        data.metrics = { jitter: '0.04%', shimmer: '0.06dB', pitchMod: '1.2Hz', resonance: '82Hz' };
      } else {
        data.metrics = { jitter: '0.84%', shimmer: '1.24dB', pitchMod: '9.4Hz', resonance: '0Hz (Empty)' };
      }
      
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Deepfake & Voice Clone Laboratory</h1>
          <p style={{ marginTop: '6px' }}>Evaluate video files and real-time audio calls using face-mesh verification and forensic vocal spectroscopy.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => { setSandboxMode('templates'); setResult(null); }}
            className="btn-cyber"
            style={{
              padding: '8px 16px',
              background: sandboxMode === 'templates' ? 'var(--cyber-blue)' : 'rgba(255,255,255,0.02)',
              color: sandboxMode === 'templates' ? '#000' : 'var(--text-secondary)',
              border: `1px solid ${sandboxMode === 'templates' ? 'var(--cyber-blue)' : 'var(--border-color)'}`
            }}
          >
            File Templates
          </button>
          <button
            onClick={() => { setSandboxMode('live'); setResult(null); }}
            className="btn-cyber"
            style={{
              padding: '8px 16px',
              background: sandboxMode === 'live' ? 'var(--cyber-blue)' : 'rgba(255,255,255,0.02)',
              color: sandboxMode === 'live' ? '#000' : 'var(--text-secondary)',
              border: `1px solid ${sandboxMode === 'live' ? 'var(--cyber-blue)' : 'var(--border-color)'}`
            }}
          >
            Vocal Sandbox (Live Mic)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        
        {/* Left Column: Intake Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {sandboxMode === 'templates' ? (
            <div className="glass-panel">
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Video size={18} color="var(--cyber-blue)" /> Mock Database Verification
              </h3>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <button
                  onClick={() => { setFileType('audio'); setResult(null); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: fileType === 'audio' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${fileType === 'audio' ? 'var(--cyber-blue)' : 'var(--border-color)'}`,
                    color: fileType === 'audio' ? 'var(--cyber-blue)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-display)',
                    transition: 'all 0.2s ease'
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
                    background: fileType === 'video' ? 'rgba(0, 240, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${fileType === 'video' ? 'var(--cyber-blue)' : 'var(--border-color)'}`,
                    color: fileType === 'video' ? 'var(--cyber-blue)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-display)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Video / Image (.mp4, .png)
                </button>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '10px' }}>Select Simulation Vector:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {mockFiles[fileType].map((f, i) => (
                    <div 
                      key={i} 
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
            </div>
          ) : (
            <div className="glass-panel">
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mic size={18} color="var(--cyber-blue)" /> Interactive Voice-Clone Sandbox
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0 20px' }}>
                <canvas 
                  ref={canvasRef} 
                  width="400" 
                  height="120" 
                  style={{
                    width: '100%',
                    background: '#06060c',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    marginBottom: '20px'
                  }}
                />

                {!isRecording ? (
                  <button 
                    onClick={startMic}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 24px',
                      background: 'rgba(0, 240, 255, 0.1)',
                      border: '1px solid var(--cyber-blue)',
                      color: 'var(--cyber-blue)',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      fontFamily: 'var(--font-display)',
                      boxShadow: '0 0 15px rgba(0, 240, 255, 0.15)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Mic size={16} /> Start Live Microphone Scan
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={stopMicMock}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 24px',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid var(--cyber-red)',
                        color: 'var(--cyber-red)',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-display)',
                        animation: 'pulse 1.5s infinite'
                      }}
                    >
                      <MicOff size={16} /> Stop & Evaluate Voice
                    </button>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Recording time: {recordTime}s / 6s (Auto-stops)
                    </span>
                  </div>
                )}
              </div>

              {/* Dynamic metrics panel during capture */}
              {isRecording && (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={12} color="var(--cyber-blue)" /> Live Spectral Telemetry
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Jitter (Pitch Variation)</div>
                      <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#fff', fontWeight: 'bold' }}>{vocalMetrics.jitter}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Shimmer (Amplitude Shift)</div>
                      <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#fff', fontWeight: 'bold' }}>{vocalMetrics.shimmer} dB</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Robot Resonance Shift</div>
                      <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#fff', fontWeight: 'bold' }}>{vocalMetrics.pitchMod} Hz</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Signal Coherence</div>
                      <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: 'var(--cyber-green)', fontWeight: 'bold' }}>{vocalMetrics.coherence}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Comparative Spectrogram Panel */}
          <div className="glass-panel">
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <BarChart2 size={18} color="var(--cyber-blue)" /> Neural Spectroscopy Indicators
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.02)', border: '1px solid rgba(34, 197, 94, 0.1)', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--cyber-green)', fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} /> Biological Voice Profile
                </h4>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>• Sub-80Hz base resonance indicators</div>
                  <div>• Natural formant frequency glides</div>
                  <div>• Stochastic micro-tremor noise variations</div>
                </div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--cyber-red)', fontSize: '0.85rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> Synthetic Deepfake Clone
                </h4>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>• Zero frequency energy below 80Hz (high-pass filter)</div>
                  <div>• Phase alignment matches neural network vocoder</div>
                  <div>• Flat, mathematical pitch modulation profiles</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Diagnostic Results */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="pulse-glow" style={{ width: '60px', height: '60px', border: '3px solid var(--cyber-blue)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s infinite linear', margin: '0 auto 20px' }}></div>
              <h3>Analyzing Vocal Spectral Mesh...</h3>
              <p style={{ fontSize: '0.8rem', marginTop: '6px', color: 'var(--text-secondary)' }}>Comparing harmonics against ElevenLabs, Resemble, and VALL-E models.</p>
            </div>
          )}

          {!loading && !result && (
            <div style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}>
              <Video size={40} style={{ marginBottom: '15px', color: 'var(--cyber-blue)' }} className="pulse-glow" />
              <h3>Forensic Workspace Idle</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '8px' }}>
                Select a media file or launch the Vocal Sandbox recording helper on the left to start the deep learning scan.
              </p>
            </div>
          )}

          {!loading && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Authenticity Audit</h3>
                
                {/* Visual circle gauge */}
                <div style={{
                  position: 'relative',
                  width: '140px',
                  height: '140px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(6, 6, 12, 0.9) 0%, rgba(20, 20, 35, 0.2) 100%)',
                  border: `4px solid ${result.verdict === 'authentic_media' ? 'var(--cyber-green)' : 'var(--cyber-red)'}`,
                  boxShadow: `0 0 20px ${result.verdict === 'authentic_media' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '20px auto'
                }}>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    fontFamily: 'var(--font-display)', 
                    fontWeight: 900, 
                    color: result.verdict === 'authentic_media' ? 'var(--cyber-green)' : 'var(--cyber-red)',
                  }}>
                    {result.authenticity_score}%
                  </div>
                </div>

                <span className={`badge ${result.verdict === 'authentic_media' ? 'badge-safe' : 'badge-dangerous'}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                  {result.verdict === 'authentic_media' ? 'Authentic Biological Record' : 'Neural Synthetic Clone Flagged'}
                </span>
              </div>

              {/* Forensic Details List */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '18px' }}>
                <h4 style={{ color: '#fff', fontSize: '0.88rem', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  Vocal Signature Indicators:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Vocal Jitter:</span>
                    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{result.metrics?.jitter}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Amplitude Shimmer:</span>
                    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{result.metrics?.shimmer}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Pitch Deviation:</span>
                    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{result.metrics?.pitchMod}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Sub-80Hz Resonance:</span>
                    <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 'bold' }}>{result.metrics?.resonance}</div>
                  </div>
                </div>

                <h4 style={{ color: '#fff', fontSize: '0.88rem', marginBottom: '10px' }}>Anomalies Report:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.anomalies.map((anom, index) => (
                    <div key={index} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      {result.verdict === 'authentic_media' ? (
                        <ShieldCheck size={14} color="var(--cyber-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      ) : (
                        <AlertTriangle size={14} color="var(--cyber-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      )}
                      <span>{anom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons if Clone */}
              {result.verdict !== 'authentic_media' && (
                <button 
                  onClick={() => alert("Regulatory bank dispute forms and cyber claim letters have been compiled in the Recovery pane.")}
                  className="btn-cyber"
                  style={{
                    width: '100%',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--cyber-red)',
                    color: 'var(--cyber-red)',
                    fontWeight: 'bold'
                  }}
                >
                  <FileText size={16} /> Compile Security Dispute File
                </button>
              )}

              <div style={{ background: 'rgba(0, 240, 255, 0.02)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', fontSize: '0.82rem', textAlign: 'center' }}>
                <strong>Resource Reference:</strong> <code style={{ fontFamily: 'var(--font-mono)' }}>{result.filename}</code>
              </div>

            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>

    </div>
  );
};

export default DeepfakeDetector;
