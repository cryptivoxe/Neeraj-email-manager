import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
    const emails = await db.email.findMany({
      orderBy: { receivedAt: 'desc' },
      select: {
        id: true,
        subject: true,
        senderName: true,
        senderEmail: true,
        company: true,
        status: true,
        priority: true,
        dueDate: true,
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
      'Due Date',
      'Received At',
      'Body',
    ];

    const rows = emails.map((email) => [
      email.id,
      email.subject,
      email.senderName,
      email.senderEmail,
      email.company ?? '',
      email.status,
      email.priority,
      email.assignedContactText ?? '',
      email.dueDate ? new Date(email.dueDate).toISOString() : '',
      new Date(email.receivedAt).toISOString(),
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
  } catch (error: any) {
    console.error('Error exporting emails data as CSV:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to export CSV' },
      { status: 500 }
    );
  }
}