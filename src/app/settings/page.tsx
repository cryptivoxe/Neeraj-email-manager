import React from 'react';
import { 
  Settings, 
  Mail, 
  Key, 
  User, 
  RefreshCw, 
  ToggleLeft, 
  CheckCircle2,
  Database
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings</h1>
          <p className="page-description">Configure authentication roles, database syncing parameters, and email integrations.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Auth Role simulation description */}
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} style={{ color: 'var(--accent)' }} />
            Authentication & Role Scaffold
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px', lineHeight: '1.6' }}>
            For the MVP, authentication is automatically simulated using the default manager record created in the database seed script:
            <strong style={{ color: 'var(--text-primary)' }}> Alex Mercer (MANAGER)</strong>.
          </p>
          
          <div style={{ padding: '12px', backgroundColor: 'var(--panel-bg)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '13px' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '6px' }}>Roles mapped in DB enum:</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              <span className="badge badge-role-manager">MANAGER</span>
              <span className="badge badge-role-admin">ADMIN</span>
              <span className="badge badge-role-staff">STAFF</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '10px' }}>
              * Upgrading to next-auth or auth0 later will map these roles to claims in JWT tokens.
            </p>
          </div>
        </div>

        {/* Email sync integration placeholders */}
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} style={{ color: 'var(--status-forwarded)' }} />
            Email Client Integration (Gmail / Outlook)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', lineHeight: '1.6' }}>
            Connect raw email accounts to automatically ingest messages, process headers, and pull threads.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Gmail Client */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--panel-bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Google Gmail API</span>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Sync inbox using OAuth2 Client credential flows.
                </p>
              </div>
              <button className="btn btn-secondary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                Connect Gmail
              </button>
            </div>

            {/* Outlook Client */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'var(--panel-bg)', border: '1px solid var(--border)', borderRadius: '6px' }}>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff' }}>Microsoft Outlook (Graph API)</span>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Sync messages from Office365 corporate mailboxes.
                </p>
              </div>
              <button className="btn btn-secondary" disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                Connect Outlook
              </button>
            </div>
          </div>
        </div>

        {/* Sync Webhook stub details */}
        <div className="card">
          <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} style={{ color: 'var(--status-waiting-reply)' }} />
            Webhook Sync Stubs
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px', lineHeight: '1.6' }}>
            The application includes an API endpoint route handler at <code>/api/sync-placeholder</code> designed to serve as the target for incoming Outlook subscriptions or Gmail push notifications.
          </p>
          <div style={{ backgroundColor: 'var(--panel-bg)', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
            POST /api/sync-placeholder<br />
            Payload: &#123; emailSource: "GMAIL", messageId: "msg-12345" &#125;
          </div>
        </div>

      </div>
    </div>
  );
}
