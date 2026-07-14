import React from 'react';
import { db } from '@/lib/db';
import { EMAIL_STATUS } from '@/lib/constants';
import { Download, BarChart3, PieChart, Info, ShieldAlert } from 'lucide-react';

export const revalidate = 0;

export default async function ReportsPage() {
  let totalEmails = 0;
  const statusCounts = {
    NEEDS_ACTION: 0,
    WAITING_REPLY: 0,
    FORWARDED: 0,
    CLOSED: 0,
    ARCHIVED: 0,
  };
  const priorityCounts = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
  };
  let totalOverdue = 0;
  let dbError = false;

  try {
    const now = new Date();
    totalEmails = await db.email.count();

    const statuses = await db.email.groupBy({
      by: ['status'],
      _count: true,
    });

    statuses.forEach((s) => {
      if (s.status in statusCounts) {
        statusCounts[s.status as keyof typeof statusCounts] = s._count;
      }
    });

    const priorities = await db.email.groupBy({
      by: ['priority'],
      _count: true,
    });

    priorities.forEach((p) => {
      if (p.priority in priorityCounts) {
        priorityCounts[p.priority as keyof typeof priorityCounts] = p._count;
      }
    });

    totalOverdue = await db.email.count({
      where: {
        dueDate: { lt: now },
        status: { notIn: [EMAIL_STATUS.CLOSED, EMAIL_STATUS.ARCHIVED] },
      },
    });
  } catch (error) {
    console.error('Error loading reports details:', error);
    dbError = true;
  }

  const getPercent = (count: number) => {
    if (totalEmails === 0) return '0%';
    return `${Math.round((count / totalEmails) * 100)}%`;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Export</h1>
          <p className="page-description">
            Analyze triage metrics, check queue volumes, and export records for auditing.
          </p>
        </div>
        {!dbError && totalEmails > 0 && (
          <a href="/api/export" className="btn btn-primary" download>
            <Download size={16} />
            <span>Download CSV Export</span>
          </a>
        )}
      </div>

      {dbError ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--status-needs-action)' }}>
            Could not load system reports. Please ensure your database is running and migrated.
          </p>
        </div>
      ) : totalEmails === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}
        >
          <Info size={32} style={{ marginBottom: '12px', color: 'var(--text-muted)' }} />
          <h3>No Data Available yet</h3>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>
            Manually add a few email records to see metrics here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Total Tracked Emails
              </span>
              <h2 style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px', color: '#ffffff' }}>
                {totalEmails}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Accumulated database logs
              </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--status-needs-action)' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Overdue Actions
              </span>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  marginTop: '8px',
                  color: 'var(--status-needs-action)',
                }}
              >
                {totalOverdue}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Items past target completion date
              </p>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--status-closed)' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                Resolution Rate
              </span>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  marginTop: '8px',
                  color: 'var(--status-closed)',
                }}
              >
                {getPercent(statusCounts.CLOSED)}
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Percentage of closed items
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card">
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <BarChart3 size={16} style={{ color: 'var(--accent)' }} />
                Status Distribution
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(statusCounts).map(([status, count]) => {
                  const percent = getPercent(count);
                  let colorVar = 'var(--status-needs-action)';

                  if (status === 'WAITING_REPLY') colorVar = 'var(--status-waiting-reply)';
                  else if (status === 'FORWARDED') colorVar = 'var(--status-forwarded)';
                  else if (status === 'CLOSED') colorVar = 'var(--status-closed)';
                  else if (status === 'ARCHIVED') colorVar = 'var(--status-archived)';

                  return (
                    <div key={status} style={{ fontSize: '13px' }}>
                      <div className="flex-between" style={{ marginBottom: '6px' }}>
                        <span style={{ fontWeight: 500 }}>{status.replace('_', ' ')}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {count} ({percent})
                        </span>
                      </div>

                      <div
                        style={{
                          height: '8px',
                          backgroundColor: 'var(--panel-bg)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: percent,
                            height: '100%',
                            backgroundColor: colorVar,
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <PieChart size={16} style={{ color: 'var(--status-waiting-reply)' }} />
                Priority Breakdown
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(priorityCounts).map(([priority, count]) => {
                  const percent = getPercent(count);
                  let colorVar = 'var(--priority-low)';

                  if (priority === 'HIGH') colorVar = 'var(--priority-high)';
                  else if (priority === 'MEDIUM') colorVar = 'var(--priority-medium)';

                  return (
                    <div key={priority} style={{ fontSize: '13px' }}>
                      <div className="flex-between" style={{ marginBottom: '6px' }}>
                        <span style={{ fontWeight: 500 }}>{priority} Priority</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          {count} ({percent})
                        </span>
                      </div>

                      <div
                        style={{
                          height: '8px',
                          backgroundColor: 'var(--panel-bg)',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: percent,
                            height: '100%',
                            backgroundColor: colorVar,
                            borderRadius: '4px',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className="card"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px' }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <ShieldAlert size={36} style={{ color: 'var(--text-muted)' }} />
              <div>
                <h4 style={{ fontWeight: 600 }}>Download Raw Backup Data</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                  Generate an instant CSV download containing subjects, senders, status logs, dates, and assignees.
                </p>
              </div>
            </div>
            <a href="/api/export" className="btn btn-secondary" download>
              <Download size={14} />
              <span>Export CSV</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}