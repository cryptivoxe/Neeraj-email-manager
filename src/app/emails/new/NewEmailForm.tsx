'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { createEmail } from '../actions';
import {
  PRIORITY,
  EMAIL_STATUS,
  type Priority,
  type EmailStatus,
} from '@/lib/constants';

const PRIORITY_OPTIONS = Object.values(PRIORITY);
const STATUS_OPTIONS = [
  EMAIL_STATUS.NEEDS_ACTION,
  EMAIL_STATUS.WAITING_REPLY,
  EMAIL_STATUS.FORWARDED,
  EMAIL_STATUS.CLOSED,
] as const;

export default function NewEmailForm() {
  const router = useRouter();

  const [subject, setSubject] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [company, setCompany] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<Priority>(PRIORITY.MEDIUM);
  const [status, setStatus] = useState<EmailStatus>(EMAIL_STATUS.NEEDS_ACTION);
  const [dueDate, setDueDate] = useState('');
  const [assignedContactText, setAssignedContactText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!subject.trim() || !senderName.trim() || !senderEmail.trim() || !body.trim()) {
      setError('Please fill in all required fields (Subject, Department, Sender Email, and Body).');
      return;
    }

    setLoading(true);

    const result = await createEmail({
      subject: subject.trim(),
      senderName: senderName.trim(),
      senderEmail: senderEmail.trim(),
      company: company.trim() || undefined,
      body: body.trim(),
      priority,
      status,
      dueDate: dueDate || undefined,
      assignedContactText: assignedContactText.trim() || undefined,
    });

    setLoading(false);

    if (result.success && result.emailId) {
      router.push(`/emails/${result.emailId}`);
      router.refresh();
    } else {
      setError(result.error || 'Failed to create email record. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link
          href="/emails"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          <ArrowLeft size={14} />
          Back to All Emails
        </Link>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                padding: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--status-needs-action)',
                borderRadius: '6px',
                fontSize: '13px',
                marginBottom: '20px',
                border: '1px solid rgba(239, 68, 68, 0.2)',
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Subject *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Broken API billing issue"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department / Sender Name *</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Finance Department"
                required
              />
            </div>

            <div className="form-group">
              <label>Sender Email *</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. billing@company.com"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company / Vendor</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Industries"
              />
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EmailStatus)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replaceAll('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Assigned Contact</label>
            <input
              type="text"
              value={assignedContactText}
              onChange={(e) => setAssignedContactText(e.target.value)}
              placeholder="e.g. Riya Sharma / Procurement"
            />
          </div>

          <div className="form-group">
            <label>Email Body *</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Paste the email content here..."
              style={{ minHeight: '160px' }}
              required
            />
          </div>

          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
            }}
          >
            <Link href="/emails" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={14} />
                  Saving...
                </>
              ) : (
                <>
                  <Mail size={14} />
                  Save Record
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}