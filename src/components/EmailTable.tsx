'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Priority, EmailStatus } from '@/lib/constants';
import StatusBadge from './StatusBadge';
import { formatDate } from '@/lib/utils';
import { User, Trash2, SquarePen } from 'lucide-react';
import { deleteSelectedEmails } from '@/app/emails/actions';

interface Email {
  id: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  company: string | null;
  receivedAt: Date;
  closedAt: Date | null;
  priority: Priority;
  status: EmailStatus;
  assignedContactText: string | null;
}

interface EmailTableProps {
  emails: Email[];
}

export default function EmailTable({ emails }: EmailTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const allIds = useMemo(() => emails.map((email) => email.id), [emails]);
  const allSelected = emails.length > 0 && selectedIds.length === emails.length;
  const hasSelection = selectedIds.length > 0;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allIds);
    }
  };

  const toggleSelectOne = (emailId: string) => {
    setSelectedIds((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId]
    );
  };

  const handleDeleteSelected = async () => {
    if (!hasSelection) return;

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected email record(s)? This cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deleteSelectedEmails(selectedIds);
    setIsDeleting(false);

    if (result.success) {
      setSelectedIds([]);
      router.refresh();
      alert(`${result.deletedCount ?? 0} record(s) deleted successfully.`);
    } else {
      alert(result.error || 'Failed to delete selected records.');
    }
  };

  if (emails.length === 0) {
    return (
      <div
        className="card"
        style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: 'var(--text-secondary)',
        }}
      >
        <p>No email records found. Try modifying filters or add a new email manually.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div
        className="card"
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {hasSelection
            ? `${selectedIds.length} email record(s) selected`
            : 'Select records to delete unnecessary data and save storage.'}
        </div>

        <button
          type="button"
          onClick={handleDeleteSelected}
          disabled={!hasSelection || isDeleting}
          className="btn btn-secondary"
          style={{
            padding: '8px 12px',
            fontSize: '12px',
            background: hasSelection ? 'rgba(239, 68, 68, 0.12)' : undefined,
            color: hasSelection ? '#ef4444' : undefined,
            border: hasSelection ? '1px solid rgba(239, 68, 68, 0.25)' : undefined,
            opacity: !hasSelection || isDeleting ? 0.6 : 1,
            cursor: !hasSelection || isDeleting ? 'not-allowed' : 'pointer',
          }}
        >
          <Trash2 size={14} />
          <span>{isDeleting ? 'Deleting...' : 'Delete Selected'}</span>
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '44px' }}>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  aria-label="Select all emails"
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th>Priority</th>
              <th>Subject</th>
              <th>Sender / Company</th>
              <th>Received</th>
              <th>Status</th>
              <th>Assigned Contact</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {emails.map((email) => {
              const isSelected = selectedIds.includes(email.id);

              return (
                <tr
                  key={email.id}
                  style={{
                    ...(isSelected ? { backgroundColor: 'rgba(99, 102, 241, 0.08)' } : {}),
                  }}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(email.id)}
                      aria-label={`Select email ${email.subject}`}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>

                  <td>
                    <StatusBadge type="priority" value={email.priority} />
                  </td>

                  <td>
                    <Link
                      href={`/emails/${email.id}`}
                      style={{
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                      }}
                    >
                      {email.subject}
                    </Link>
                  </td>

                  <td>
                    <div style={{ fontSize: '13px' }}>{email.senderName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {email.company ? `${email.company} • ` : ''}
                      {email.senderEmail}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '13px' }}>{formatDate(email.receivedAt)}</div>
                    {email.closedAt && (
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--status-closed)',
                        }}
                      >
                        Closed: {formatDate(email.closedAt)}
                      </div>
                    )}
                  </td>

                  <td>
                    <StatusBadge type="status" value={email.status} />
                  </td>

                  <td>
                    {email.assignedContactText ? (
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          color: '#a5b4fc',
                        }}
                      >
                        <User size={12} />
                        <span>{email.assignedContactText}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Unassigned
                      </span>
                    )}
                  </td>

                  <td>
                    <Link
                      href={`/emails/${email.id}`}
                      className="btn btn-primary"
                      style={{ padding: '4px 8px', fontSize: '11px' }}
                    >
                      <SquarePen size={12} />
                      <span>Manage</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}