export const EMAIL_STATUS = {
  NEEDS_ACTION: 'NEEDS_ACTION',
  WAITING_REPLY: 'WAITING_REPLY',
  FORWARDED: 'FORWARDED',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type EmailStatus = typeof EMAIL_STATUS[keyof typeof EMAIL_STATUS];

/**
 * Formats a date string or Date object into a readable format.
 */
export function formatDate(date: Date | string | null): string {
  if (!date) return 'N/A';

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'N/A';

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date with time.
 */
export function formatDateTime(date: Date | string | null): string {
  if (!date) return 'N/A';

  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'N/A';

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Determines whether an email is overdue based on its due date and current status.
 */
export function isOverdue(
  dueDate: Date | string | null,
  status: EmailStatus
): boolean {
  if (!dueDate) return false;

  if (
    status === EMAIL_STATUS.CLOSED ||
    status === EMAIL_STATUS.ARCHIVED
  ) {
    return false;
  }

  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  if (isNaN(due.getTime())) return false;

  return due.getTime() < Date.now();
}

/**
 * Sanitizes and generates basic CSV content for emails list.
 */
export function convertToCSV(data: any[]): string {
  const headers = [
    'Subject',
    'Sender Name',
    'Sender Email',
    'Company',
    'Received At',
    'Priority',
    'Status',
    'Due Date',
    'Assignee',
  ];

  const rows = data.map((item) => {
    return [
      item.subject ?? '',
      item.senderName ?? '',
      item.senderEmail ?? '',
      item.company ?? '',
      item.receivedAt ? new Date(item.receivedAt).toISOString() : '',
      item.priority ?? '',
      item.status ?? '',
      item.dueDate ? new Date(item.dueDate).toISOString() : '',
      item.assignee?.name ?? '',
    ]
      .map((val) => {
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}