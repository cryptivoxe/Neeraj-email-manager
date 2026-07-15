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
 * Sanitizes and generates basic CSV content for emails list.
 */
export function convertToCSV(data: any[]): string {
  const headers = [
    'Subject',
    'Sender Name',
    'Sender Email',
    'Company',
    'Received At',
    'Closed At',
    'Priority',
    'Status',
    'Assigned Contact',
  ];

  const rows = data.map((item) => {
    return [
      item.subject ?? '',
      item.senderName ?? '',
      item.senderEmail ?? '',
      item.company ?? '',
      item.receivedAt ? new Date(item.receivedAt).toISOString() : '',
      item.closedAt ? new Date(item.closedAt).toISOString() : '',
      item.priority ?? '',
      item.status ?? '',
      item.assignedContactText ?? '',
    ]
      .map((val) => {
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}