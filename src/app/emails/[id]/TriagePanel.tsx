'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  addEmailAction,
  addExternalReply,
  updateEmailAssignee,
  updateEmailStatus,
} from '../actions';
import { ACTION_TYPE, EMAIL_STATUS, type EmailStatus } from '@/lib/constants';
import {
  UserPlus,
  FileText,
  MessageSquare,
  Check,
  Loader2,
} from 'lucide-react';
import styles from '@/styles/components.module.css';

interface TriagePanelProps {
  emailId: string;
  currentAssignedContactText: string | null;
  currentStatus: EmailStatus;
}

type TabType = 'note' | 'reply' | 'assign' | 'status';

export default function TriagePanel({
  emailId,
  currentAssignedContactText,
  currentStatus,
}: TriagePanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('note');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [noteContent, setNoteContent] = useState('');
  const [replySender, setReplySender] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [assignedContactText, setAssignedContactText] = useState(
    currentAssignedContactText || ''
  );
  const [selectedStatus, setSelectedStatus] = useState<EmailStatus>(currentStatus);

  const resetMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    if (!noteContent.trim()) return;

    setLoading(true);
    const result = await addEmailAction(emailId, ACTION_TYPE.NOTE, noteContent.trim());
    setLoading(false);

    if (result.success) {
      setNoteContent('');
      setSuccess('Note added successfully!');
      router.refresh();
    } else {
      setError(result.error || 'Failed to add note');
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!replySender.trim() || !replyBody.trim()) {
      setError('Please provide reply sender and body.');
      return;
    }

    setLoading(true);
    const result = await addExternalReply(emailId, replySender.trim(), replyBody.trim());
    setLoading(false);

    if (result.success) {
      setReplySender('');
      setReplyBody('');
      setSuccess('External reply logged successfully. Email status set to Needs Action.');
      router.refresh();
    } else {
      setError(result.error || 'Failed to log reply');
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    setLoading(true);
    const result = await updateEmailAssignee(
      emailId,
      assignedContactText.trim() || null
    );
    setLoading(false);

    if (result.success) {
      setSuccess('Assigned contact updated successfully!');
      router.refresh();
    } else {
      setError(result.error || 'Failed to update assigned contact');
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    setLoading(true);
    const result = await updateEmailStatus(emailId, selectedStatus);
    setLoading(false);

    if (result.success) {
      setSuccess('Status updated successfully!');
      router.refresh();
    } else {
      setError(result.error || 'Failed to update status');
    }
  };

  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
        Triage Action Workspace
      </h3>

      <div className={styles.tabs}>
        <button
          onClick={() => {
            setActiveTab('note');
            resetMessages();
          }}
          className={`${styles.tab} ${activeTab === 'note' ? styles.activeTab : ''}`}
        >
          <FileText size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
          Add Note
        </button>
        <button
          onClick={() => {
            setActiveTab('reply');
            resetMessages();
          }}
          className={`${styles.tab} ${activeTab === 'reply' ? styles.activeTab : ''}`}
        >
          <MessageSquare size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
          Log Reply
        </button>
        <button
          onClick={() => {
            setActiveTab('assign');
            resetMessages();
          }}
          className={`${styles.tab} ${activeTab === 'assign' ? styles.activeTab : ''}`}
        >
          <UserPlus size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
          Assign / Forward
        </button>
        <button
          onClick={() => {
            setActiveTab('status');
            resetMessages();
          }}
          className={`${styles.tab} ${activeTab === 'status' ? styles.activeTab : ''}`}
        >
          <Check size={14} style={{ marginRight: '6px', verticalAlign: 'middle', display: 'inline' }} />
          Change Status
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--status-needs-action)',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--status-closed)',
            borderRadius: '6px',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {success}
        </div>
      )}

      {activeTab === 'note' && (
        <form onSubmit={handleNoteSubmit}>
          <div className="form-group">
            <label>Internal Note / Follow-up Details</label>
            <textarea
              placeholder="Add thoughts, notes on conversations, or checklist..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || !noteContent.trim()}>
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Log Note'}
          </button>
        </form>
      )}

      {activeTab === 'reply' && (
        <form onSubmit={handleReplySubmit}>
          <div className="form-group">
            <label>Reply Sender Email / Name</label>
            <input
              type="text"
              placeholder="e.g. sarah.c@company.com or Client Support"
              value={replySender}
              onChange={(e) => setReplySender(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Reply Message Body</label>
            <textarea
              placeholder="Paste reply text content..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Log External Reply'}
          </button>
        </form>
      )}

      {activeTab === 'assign' && (
        <form onSubmit={handleAssignSubmit}>
          <div className="form-group">
            <label>Assign to Department or Employee / Vendor</label>
            <input
              type="text"
              value={assignedContactText}
              onChange={(e) => setAssignedContactText(e.target.value)}
              placeholder="e.g. Riya Sharma / Procurement Team"
            />
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Adding an assigned contact will automatically change status to <strong>FORWARDED</strong>.
            </p>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Save Assignment'}
          </button>
        </form>
      )}

      {activeTab === 'status' && (
        <form onSubmit={handleStatusSubmit}>
          <div className="form-group">
            <label>Set Email Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as EmailStatus)}
            >
              {Object.values(EMAIL_STATUS).map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Update Status'}
          </button>
        </form>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}