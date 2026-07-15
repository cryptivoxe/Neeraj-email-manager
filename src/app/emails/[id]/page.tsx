import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { EMAIL_STATUS, PRIORITY, ACTION_TYPE } from '@/lib/constants';
import {
  updateEmailDetails,
  updateEmailStatus,
  addEmailAction,
  addExternalReply,
  deleteEmail,
} from '@/app/emails/actions';
import { ArrowLeft, Save, Trash2, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

type PageProps = {
  params: Promise<{ id: string }>;
};

type EmailActionItem = {
  id: string;
  type: string;
  description: string;
  createdAt: Date;
};

type EmailReplyItem = {
  id: string;
  sender: string;
  body: string;
  createdAt: Date;
};

type AuditLogItem = {
  id: string;
  actionType: string;
  details: string;
  createdAt: Date;
};

export default async function EmailDetailPage({ params }: PageProps) {
  const { id } = await params;

  const email = await db.email.findUnique({
    where: { id },
    include: {
      actions: {
        orderBy: { createdAt: 'desc' },
      },
      replies: {
        orderBy: { createdAt: 'desc' },
      },
      auditLogs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!email) {
    notFound();
  }

  async function saveDetails(formData: FormData) {
    'use server';

    const senderEmailRaw = String(formData.get('senderEmail') || '').trim();

    const result = await updateEmailDetails({
      emailId: id,
      subject: String(formData.get('subject') || ''),
      senderName: String(formData.get('senderName') || ''),
      senderEmail: senderEmailRaw || undefined,
      company: String(formData.get('company') || ''),
      body: String(formData.get('body') || ''),
      priority: String(formData.get('priority') || PRIORITY.MEDIUM) as (typeof PRIORITY)[keyof typeof PRIORITY],
      status: String(formData.get('status') || EMAIL_STATUS.NEEDS_ACTION) as (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS],
      assignedContactText: String(formData.get('assignedContactText') || ''),
    });

    if (!result.success) {
      throw new Error(result.error || 'Failed to update email');
    }
  }

  async function saveStatusOnly(formData: FormData) {
    'use server';

    const status = String(formData.get('status') || '') as (typeof EMAIL_STATUS)[keyof typeof EMAIL_STATUS];
    const result = await updateEmailStatus(id, status);

    if (!result.success) {
      throw new Error(result.error || 'Failed to update status');
    }
  }

  async function submitAction(formData: FormData) {
    'use server';

    const type = String(formData.get('type') || '') as (typeof ACTION_TYPE)[keyof typeof ACTION_TYPE];
    const description = String(formData.get('description') || '');
    const result = await addEmailAction(id, type, description);

    if (!result.success) {
      throw new Error(result.error || 'Failed to add action');
    }
  }

  async function submitReply(formData: FormData) {
    'use server';

    const sender = String(formData.get('sender') || '');
    const body = String(formData.get('body') || '');
    const result = await addExternalReply(id, sender, body);

    if (!result.success) {
      throw new Error(result.error || 'Failed to add reply');
    }
  }

  async function removeEmail() {
    'use server';

    const result = await deleteEmail(id);

    if (!result.success) {
      throw new Error(result.error || 'Failed to delete email');
    }

    redirect('/emails');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="page-header">
        <div>
          <Link
            href="/emails"
            className="btn btn-secondary"
            style={{ marginBottom: '12px', width: 'fit-content' }}
          >
            <ArrowLeft size={14} />
            <span>Back to Emails</span>
          </Link>
          <h1 className="page-title">{email.subject}</h1>
          <p className="page-description">
            View the full record, edit original details, and change status manually.
          </p>
        </div>
      </div>

      <div className="detail-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="section-header">
              <h3>Edit Email Details</h3>
            </div>

            <form action={saveDetails} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <input name="subject" defaultValue={email.subject} required />
                </div>
                <div className="form-group">
                  <label>Company</label>
                  <input name="company" defaultValue={email.company ?? ''} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Sender Name</label>
                  <input name="senderName" defaultValue={email.senderName} required />
                </div>
                <div className="form-group">
                  <label>Sender Email</label>
                  <input
                    name="senderEmail"
                    type="email"
                    defaultValue={email.senderEmail ?? ''}
                    placeholder="e.g. billing@company.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" defaultValue={email.priority}>
                    {Object.values(PRIORITY).map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select name="status" defaultValue={email.status}>
                    {Object.values(EMAIL_STATUS).map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Assigned Contact</label>
                <input
                  name="assignedContactText"
                  defaultValue={email.assignedContactText ?? ''}
                  placeholder="e.g. Procurement Team"
                />
              </div>

              <div className="form-group">
                <label>Email Body</label>
                <textarea name="body" defaultValue={email.body} rows={8} required />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary">
                  <Save size={14} />
                  <span>Save Details</span>
                </button>
              </div>
            </form>
          </div>

          <div className="card">
            <div className="section-header">
              <h3>Quick Status Update</h3>
            </div>

            <form action={saveStatusOnly} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select
                name="status"
                defaultValue={email.status}
                style={{ minWidth: '220px' }}
              >
                {Object.values(EMAIL_STATUS).map((status) => (
                  <option key={status} value={status}>
                    {status.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>

              <button type="submit" className="btn btn-secondary">
                <CheckCircle2 size={14} />
                <span>Update Status</span>
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="section-header">
              <h3>Current Snapshot</h3>
            </div>

            <div className="summary-list">
              <div><span>ID</span><strong>{email.id}</strong></div>
              <div><span>Status</span><strong>{email.status.replaceAll('_', ' ')}</strong></div>
              <div><span>Priority</span><strong>{email.priority}</strong></div>
              <div><span>Sender</span><strong>{email.senderName}</strong></div>
              <div><span>Email</span><strong>{email.senderEmail || 'Not provided'}</strong></div>
              <div><span>Assigned</span><strong>{email.assignedContactText || 'Unassigned'}</strong></div>
              <div>
                <span>Closed At</span>
                <strong>
                  {email.closedAt ? new Date(email.closedAt).toLocaleString() : 'Not closed'}
                </strong>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="section-header">
              <h3>Actions</h3>
            </div>

            {email.actions.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No actions recorded yet.</p>
            ) : (
              <div className="timeline">
                {(email.actions as EmailActionItem[]).map((action: EmailActionItem) => (
                  <div key={action.id} className="timeline-item">
                    <strong>{action.type.replaceAll('_', ' ')}</strong>
                    <p>{action.description}</p>
                    <span>{new Date(action.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="section-header">
              <h3>Replies</h3>
            </div>

            {email.replies.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No replies recorded yet.</p>
            ) : (
              <div className="timeline">
                {(email.replies as EmailReplyItem[]).map((reply: EmailReplyItem) => (
                  <div key={reply.id} className="timeline-item">
                    <strong>{reply.sender}</strong>
                    <p>{reply.body}</p>
                    <span>{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="section-header">
              <h3>Audit Log</h3>
            </div>

            {email.auditLogs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No audit history available.</p>
            ) : (
              <div className="timeline">
                {(email.auditLogs as AuditLogItem[]).map((log: AuditLogItem) => (
                  <div key={log.id} className="timeline-item">
                    <strong>{log.actionType}</strong>
                    <p>{log.details}</p>
                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="section-header">
              <h3>Danger Zone</h3>
            </div>

            <form action={removeEmail}>
              <button type="submit" className="btn btn-danger">
                <Trash2 size={14} />
                <span>Delete Email</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}