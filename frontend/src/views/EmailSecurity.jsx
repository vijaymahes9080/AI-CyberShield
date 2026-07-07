import React, { useState } from 'react';
import { Mail, ShieldCheck, AlertTriangle, ArrowRight, Eye } from 'lucide-react';

const EmailSecurity = () => {
  const [selectedMail, setSelectedMail] = useState(null);

  const quarantineEmails = [
    {
      id: 1,
      sender: 'accounts@netflix-payment-update.com',
      realName: 'Netflix Billing Support',
      subject: 'Card Declined - Update your payment profile immediately',
      date: 'Today, 10:20',
      risk: 94,
      category: 'Phishing',
      details: 'Typosquatting domain mimicry netflix-payment-update.com (Netflix). Sent from unverified IP: 185.220.101.4.'
    },
    {
      id: 2,
      sender: 'invoice-finance@dropbox-sharing.com',
      realName: 'Dropbox Services',
      subject: 'Receipt confirmation - Order #88127390',
      date: 'Yesterday, 15:40',
      risk: 86,
      category: 'Malware Link',
      details: 'Attachment invoice_8812.pdf contains malicious javascript macro calling domain blacklists.'
    },
    {
      id: 3,
      sender: 'hr-payroll@amazon-careers-direct.com',
      realName: 'Amazon HR Division',
      subject: 'Remote Application Approval — Documents required',
      date: 'June 22, 09:12',
      risk: 91,
      category: 'Credential Harvester',
      details: 'Links in body resolve to unverified dynamic zip page (amazon-hr-verify.zip).'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div>
        <h1>Email Security Platform</h1>
        <p style={{ marginTop: '6px' }}>Filter corporate and individual inbox servers against header spoofing and malicious attachments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' }}>
        
        {/* Table of Quarantined emails */}
        <div className="glass-panel">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
            Quarantine Inbox List
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quarantineEmails.map((mail) => (
              <div 
                key={mail.id} 
                onClick={() => setSelectedMail(mail)}
                style={{ 
                  background: selectedMail?.id === mail.id ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255,255,255,0.01)', 
                  border: `1px solid ${selectedMail?.id === mail.id ? 'var(--cyber-blue)' : 'var(--border-color)'}`, 
                  padding: '14px', 
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={16} color="var(--cyber-red)" />
                    <span style={{ fontSize: '0.86rem', fontWeight: 'bold', color: '#fff' }}>{mail.realName}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>&lt;{mail.sender}&gt;</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', marginTop: '6px', color: 'var(--text-secondary)' }}>
                    Subject: {mail.subject}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-dangerous" style={{ fontSize: '0.65rem' }}>{mail.risk}% Risk</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>{mail.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Inspector Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {!selectedMail ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <Mail size={40} style={{ marginBottom: '15px' }} />
              <h3>Select Email</h3>
              <p style={{ fontSize: '0.82rem', marginTop: '6px' }}>Click any email from the quarantine inbox to run header and link analysis inspect files.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', color: 'var(--cyber-blue)' }}>
                Email Inspector
              </h3>

              <div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Subject Line:</span>
                <div style={{ fontSize: '0.92rem', fontWeight: 'bold', color: '#fff', marginTop: '2px' }}>{selectedMail.subject}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Attack Type:</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 'bold', color: 'var(--cyber-red)', marginTop: '2px' }}>{selectedMail.category}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Date Flagged:</span>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{selectedMail.date}</div>
                </div>
              </div>

              <div style={{ background: 'rgba(255, 51, 102, 0.02)', border: '1px solid rgba(255, 51, 102, 0.12)', padding: '14px', borderRadius: '8px', fontSize: '0.82rem' }}>
                <h4 style={{ color: 'var(--cyber-red)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} /> Malware & Spoofing indicators:
                </h4>
                <p style={{ lineHeight: '1.4', color: 'var(--text-secondary)' }}>{selectedMail.details}</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={() => alert('Email permanently deleted from mail servers.')}
                  className="btn-cyber" 
                  style={{ flex: 1, borderColor: 'var(--cyber-red)', color: 'var(--cyber-red)' }}
                >
                  Delete Mail
                </button>
                <button 
                  onClick={() => alert('Quarantined warning template auto-delivered back to target sender domain.')}
                  className="btn-cyber" 
                  style={{ flex: 1 }}
                >
                  Quarantine Alert
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default EmailSecurity;
