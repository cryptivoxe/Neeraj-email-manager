import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import EmailTable from '@/components/EmailTable';
import {
  EMAIL_STATUS,
  PRIORITY,
  type EmailStatus,
  type Priority,
} from '@/lib/constants';
import { PlusCircle, Filter, RotateCcw, Search } from 'lucide-react';
import styles from '@/styles/components.module.css';

export const revalidate = 0;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function EmailsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const q = typeof params.q === 'string' ? params.q : '';
  const status = typeof params.status === 'string' ? params.status : '';
  const priority = typeof params.priority === 'string' ? params.priority : '';
  const assignedContactText =
    typeof params.assignedContactText === 'string' ? params.assignedContactText : '';
  const receivedFrom =
    typeof params.receivedFrom === 'string' ? params.receivedFrom : '';
  const receivedTo =
    typeof params.receivedTo === 'string' ? params.receivedTo : '';

  let emails: any[] = [];
  let dbError = false;

  try {
    const where: any = {};

    if (q) {
      where.OR = [
        { subject: { contains: q, mode: 'insensitive' } },
        { senderName: { contains: q, mode: 'insensitive' } },
        { senderEmail: { contains: q, mode: 'insensitive' } },
        { company: { contains: q, mode: 'insensitive' } },
        { body: { contains: q, mode: 'insensitive' } },
        { assignedContactText: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status as EmailStatus;
    }

    if (priority) {
      where.priority = priority as Priority;
    }

    if (assignedContactText) {
      where.assignedContactText = {
        contains: assignedContactText,
        mode: 'insensitive',
      };
    }

    if (receivedFrom || receivedTo) {
      where.receivedAt = {};

      if (receivedFrom) {
        where.receivedAt.gte = new Date(`${receivedFrom}T00:00:00.000Z`);
      }

      if (receivedTo) {
        where.receivedAt.lte = new Date(`${receivedTo}T23:59:59.999Z`);
      }
    }

    emails = await db.email.findMany({
      where,
      orderBy: [{ receivedAt: 'desc' }],
      select: {
        id: true,
        subject: true,
        senderName: true,
        senderEmail: true,
        company: true,
        receivedAt: true,
        dueDate: true,
        priority: true,
        status: true,
        assignedContactText: true,
      },
    });
  } catch (error) {
    console.error('Error fetching emails list:', error);
    dbError = true;
  }

  const hasActiveFilters =
    q || status || priority || assignedContactText || receivedFrom || receivedTo;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">All Emails</h1>
          <p className="page-description">
            Search, filter, and triage all incoming email communications.
          </p>
        </div>
        <Link href="/emails/new" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>New Email</span>
        </Link>
      </div>

      {dbError ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--status-needs-action)' }}>
            Could not load email records. Please ensure your database is running and migrated.
          </p>
        </div>
      ) : (
        <>
          <form method="GET" action="/emails" className={styles.filterContainer}>
            <div className={styles.filterHeader}>
              <div className={styles.filterTitle}>
                <Filter size={16} style={{ color: 'var(--accent)' }} />
                <span>Search & Filter</span>
              </div>

              {hasActiveFilters && (
                <Link
                  href="/emails"
                  className="btn btn-secondary"
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RotateCcw size={12} />
                  Reset Filters
                </Link>
              )}
            </div>

            <div className={styles.filterGrid}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Keyword Search</label>
                <input
                  type="text"
                  name="q"
                  placeholder="Subject, department, sender email, assigned contact..."
                  defaultValue={q}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Status</label>
                <select name="status" defaultValue={status}>
                  <option value="">All Statuses</option>
                  {Object.values(EMAIL_STATUS).map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Priority</label>
                <select name="priority" defaultValue={priority}>
                  <option value="">All Priorities</option>
                  {Object.values(PRIORITY).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Assigned Contact</label>
                <input
                  type="text"
                  name="assignedContactText"
                  placeholder="e.g. Procurement Team"
                  defaultValue={assignedContactText}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Received From</label>
                <input
                  type="date"
                  name="receivedFrom"
                  defaultValue={receivedFrom}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Received To</label>
                <input
                  type="date"
                  name="receivedTo"
                  defaultValue={receivedTo}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button type="submit" className="btn btn-primary" style={{ minWidth: '100px' }}>
                <Search size={14} />
                <span>Apply Filters</span>
              </button>
            </div>
          </form>

          <EmailTable emails={emails} />
        </>
      )}
    </div>
  );
}