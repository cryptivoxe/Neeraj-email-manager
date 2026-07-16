import React from 'react';
import {
  EMAIL_STATUS,
  PRIORITY,
  CONTACT_ROLE,
  type EmailStatus,
  type Priority,
  type ContactRole,
} from '@/lib/constants';

interface StatusBadgeProps {
  type: 'status' | 'priority' | 'role';
  value: EmailStatus | Priority | ContactRole | string;
}

export default function StatusBadge({ type, value }: StatusBadgeProps) {
  if (type === 'status') {
    const label = String(value).replace(/_/g, ' ');
    let badgeClass = 'badge-needs-action';

    if (value === EMAIL_STATUS.WIP) badgeClass = 'badge-wip';
    else if (value === EMAIL_STATUS.WAITING_REPLY) badgeClass = 'badge-waiting-reply';
    else if (value === EMAIL_STATUS.FORWARDED) badgeClass = 'badge-forwarded';
    else if (value === EMAIL_STATUS.CLOSED) badgeClass = 'badge-closed';
    else if (value === EMAIL_STATUS.ARCHIVED) badgeClass = 'badge-archived';

    return <span className={`badge ${badgeClass}`}>{label}</span>;
  }

  if (type === 'priority') {
    let badgeClass = 'badge-medium';

    if (value === PRIORITY.HIGH) badgeClass = 'badge-high';
    else if (value === PRIORITY.LOW) badgeClass = 'badge-low';

    return <span className={`badge ${badgeClass}`}>{String(value)}</span>;
  }

  if (type === 'role') {
    let badgeClass = 'badge-role-staff';

    if (value === CONTACT_ROLE.EMPLOYEE) badgeClass = 'badge-role-manager';
    else if (value === CONTACT_ROLE.VENDOR) badgeClass = 'badge-role-admin';

    return <span className={`badge ${badgeClass}`}>{String(value)}</span>;
  }

  return <span className="badge">{String(value)}</span>;
}