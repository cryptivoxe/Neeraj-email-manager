import React from 'react';
import { EmailStatus, Priority, ContactRole } from '@prisma/client';

interface StatusBadgeProps {
  type: 'status' | 'priority' | 'role';
  value: EmailStatus | Priority | ContactRole | string;
}

export default function StatusBadge({ type, value }: StatusBadgeProps) {
  if (type === 'status') {
    const label = value.replace('_', ' ');
    let badgeClass = 'badge-needs-action';
    
    if (value === EmailStatus.WAITING_REPLY) badgeClass = 'badge-waiting-reply';
    else if (value === EmailStatus.FORWARDED) badgeClass = 'badge-forwarded';
    else if (value === EmailStatus.CLOSED) badgeClass = 'badge-closed';
    else if (value === EmailStatus.ARCHIVED) badgeClass = 'badge-archived';
    
    return <span className={`badge ${badgeClass}`}>{label}</span>;
  }
  
  if (type === 'priority') {
    let badgeClass = 'badge-medium';
    if (value === Priority.HIGH) badgeClass = 'badge-high';
    else if (value === Priority.LOW) badgeClass = 'badge-low';
    
    return <span className={`badge ${badgeClass}`}>{value}</span>;
  }

  if (type === 'role') {
    let badgeClass = 'badge-role-staff';
    if (value === ContactRole.EMPLOYEE) badgeClass = 'badge-role-manager';
    else if (value === ContactRole.VENDOR) badgeClass = 'badge-role-admin';
    
    return <span className={`badge ${badgeClass}`}>{value}</span>;
  }

  return <span className="badge">{value}</span>;
}
