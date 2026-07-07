import React, { useState, useEffect } from 'react';
import { Laptop, ShieldCheck, AlertTriangle, Cpu, Activity } from 'lucide-react';

const DeviceSecurity = () => {
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);

  const fetchDeviceStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/device/status');
      const data = await response.json();
      setDevice(data);
      
      const logs = [
        `[16:42:01] System process auditor initiated.`,
        `[16:42:03] Monitored Active Ports: Port 443 (Nginx Link), Port 8000 (FastAPI Core).`,
        `[16:42:05] Hardware status verified: Camera = ${data.camera_active ? 'ACTIVE' : 'IDLE'}, Mic = ${data.mic_active ? 'ACTIVE' : 'IDLE'}.`,
        `[16:42:08] Operating System: ${data.os_type} (Patch version ${data.app_version}) secured.`
      ];
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceStatus();
  }, []);

  const triggerAudit = async () => {
    setLoading(true);
    try {
      // Toggle microphone mock state to run a different telemetry audit score
      const response = await fetch('http://127.0.0.1:8000/api/device/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          device_name: 'DESKTOP-VIJAY',
          os_type: 'Windows',
          app_version: '1.4.2',
          camera_active: false,
          mic_active: true // Simulate Mic turn on to trigger warning
        })
      });
      const data = await response.json();
      setDevice(data);
      
      setAuditLogs(prev => [
        ...prev,
        `[${new Date().toTimeString().split(' ')[0]}] AUDIT: Microphone sensor activation flagged during background telemetry check.`,
        `[${new Date().toTimeString().split(' ')[0]}] WARNING: Trust score adjusted to ${data.trust_score}% due to sensor activity.`
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (score) => {
    if (score >= 90) return 'var(--cyber-green)';
    if (score >= 70) return 'var(--cyber-orange)';
    return 'var(--cyber-red)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>Device Security Center</h1>
        <p style={{ marginTop: '6px' }}>Monitor client app telemetry, camera/microphone sensors activity, and background running process threads.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '30px' }}>
        
        {/* Core telemetry details */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifycontent: 'space-between' }}>
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
              Device Health Diagnostics
            </h3>

            {loading || !device ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Loading diagnostics...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Device Name:</span>
                  <strong style={{ color: '#fff' }}>{device.device_name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Operating System:</span>
                  <strong style={{ color: '#fff' }}>{device.os_type}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Client App Version:</span>
                  <strong style={{ color: '#fff' }}>{device.app_version}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <span>Camera Sensor:</span>
                  <span className={`badge ${device.camera_active ? 'badge-dangerous' : 'badge-safe'}`}>
                    {device.camera_active ? 'ACTIVE' : 'BLOCKED / IDLE'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Microphone Sensor:</span>
                  <span className={`badge ${device.mic_active ? 'badge-dangerous' : 'badge-safe'}`}>
                    {device.mic_active ? 'ACTIVE' : 'BLOCKED / IDLE'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px' }}>
            <button 
              onClick={triggerAudit}
              className="btn-cyber" 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Running Diagnostic checks...' : 'Execute Telemetry Scan'}
            </button>
          </div>
        </div>

        {/* Status logs and Gauges */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {device && (
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Diagnostic Trust Score</span>
              <h2 style={{ fontSize: '3rem', color: getHealthColor(device.trust_score), marginTop: '8px' }}>
                {device.trust_score}%
              </h2>
            </div>
          )}

          <div>
            <h4 style={{ fontSize: '0.88rem', color: '#fff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="var(--cyber-blue)" /> Diagnostic Process Log
            </h4>
            <div className="terminal-log" style={{ height: '180px' }}>
              {auditLogs.map((log, idx) => (
                <div key={idx} className="terminal-line">
                  <span className="terminal-prefix">&gt;</span>
                  <span className={log.includes('WARNING') ? 'terminal-error' : ''}>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DeviceSecurity;
