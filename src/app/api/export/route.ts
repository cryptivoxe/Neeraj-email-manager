import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

type ExportEmail = {
  id: string;
  subject: string;
  senderName: string;
  senderEmail: string;
  company: string | null;
  status: string;
  priority: string;
  closedAt: Date | null;
  receivedAt: Date;
  body: string;
  assignedContactText: string | null;
};

function escapeCsv(value: unknown) {
  if (value === null || value === undefined) return '';
  const str = String(value);

  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

export async function GET() {
  try {
    const emails: ExportEmail[] = await db.email.findMany({
      orderBy: { receivedAt: 'desc' },
      select: {
        id: true,
        subject: true,
        senderName: true,
        senderEmail: true,
        company: true,
        status: true,
        priority: true,
        closedAt: true,
        receivedAt: true,
        body: true,
        assignedContactText: true,
      },
    });

    const headers = [
      'ID',
      'Subject',
      'Department',
      'Sender Email',
      'Company',
      'Status',
      'Priority',
      'Assigned Contact',
      'Closed At',
      'Received At',
      'Body',
    ];

    const rows = emails.map((email: ExportEmail) => [
      email.id,
      email.subject,
      email.senderName,
      email.senderEmail,
      email.company ?? '',
      email.status,
      email.priority,
      email.assignedContactText ?? '',
      email.closedAt ? email.closedAt.toISOString() : '',
      email.receivedAt.toISOString(),
      email.body,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(','))
      .join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="manager_emails_export.csv"',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error: unknown) {
    console.error('Error exporting emails data as CSV:', error);

    const message =
      error instanceof Error ? error.message : 'Failed to export CSV';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}