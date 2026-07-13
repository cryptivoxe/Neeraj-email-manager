import React from 'react';

export const EMAIL_STATUS = {
  NEEDS_ACTION: 'NEEDS_ACTION',
  WAITING_REPLY: 'WAITING_REPLY',
  FORWARDED: 'FORWARDED',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export const CONTACT_ROLE = {
  EMPLOYEE: 'EMPLOYEE',
  VENDOR: 'VENDOR',
  CLIENT: 'CLIENT',
} as const;

type EmailStatus = typeof EMAIL_STATUS[keyof typeof EMAIL_STATUS];
type Priority = typeof PRIORITY[keyof typeof PRIORITY];
type ContactRole = typeof CONTACT_ROLE[keyof typeof CONTACT_ROLE];

interface StatusBadgeProps {
  type: 'status' | 'priority' | 'role';
  value: EmailStatus | Priority | ContactRole | string;
}

export default function StatusBadge({ type, value }: StatusBadgeProps) {
  if (type === 'status') {
    const label = String(value).replace(/_/g, ' ');
    let badgeClass = 'badge-needs-action';

    if (value === EMAIL_STATUS.WAITING_REPLY) badgeClass = 'badge-waiting-reply';
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