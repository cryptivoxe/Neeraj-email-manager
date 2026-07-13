import React from 'react';
import { db } from '@/lib/db';
import ContactForm from './ContactForm';
import StatusBadge from '@/components/StatusBadge';
import { 
  Users, 
  Mail, 
  Building, 
  Briefcase,
  Layers
} from 'lucide-react';
import styles from '@/styles/components.module.css';

export const revalidate = 0;

export default async function ContactsPage() {
  let contacts: any[] = [];
  let dbError = false;

  try {
    contacts = await db.contact.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching contacts list:', error);
    dbError = true;
  }

  const employees = contacts.filter((c) => c.role === 'EMPLOYEE');
  const vendors = contacts.filter((c) => c.role === 'VENDOR');
  const clients = contacts.filter((c) => c.role === 'CLIENT');

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact Directory</h1>
          <p className="page-description">Manage internal team members, external service vendors, and client accounts.</p>
        </div>
      </div>

      {dbError ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--status-needs-action)' }}>Could not load contact directory. Please ensure your database is running and migrated.</p>
        </div>
      ) : (
        <div className={styles.detailGrid}>
          {/* Left Column: Grouped lists */}
          <div className={styles.detailSection}>
            {/* Tab/Heading section for Roles */}
            
            {/* 1. Employees */}
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc' }}>
                <Briefcase size={16} />
                Employees / Staff ({employees.length})
              </h3>
              
              {employees.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No employees registered in the directory.</p>
              ) : (
                <div className={styles.contactGrid}>
                  {employees.map((c) => (
                    <div key={c.id} className={styles.contactCard}>
                      <div className={styles.contactHeader}>
                        <span className={styles.contactName}>{c.name}</span>
                        <StatusBadge type="role" value={c.role} />
                      </div>
                      <div className={styles.contactDetails}>
                        {c.email && (
                          <div className={styles.contactDetailRow}>
                            <Mail size={12} />
                            <span>{c.email}</span>
                          </div>
                        )}
                        {c.company && (
                          <div className={styles.contactDetailRow}>
                            <Layers size={12} />
                            <span>{c.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Vendors */}
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc' }}>
                <Building size={16} />
                Vendors / Partners ({vendors.length})
              </h3>
              
              {vendors.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No vendor accounts registered.</p>
              ) : (
                <div className={styles.contactGrid}>
                  {vendors.map((c) => (
                    <div key={c.id} className={styles.contactCard}>
                      <div className={styles.contactHeader}>
                        <span className={styles.contactName}>{c.name}</span>
                        <StatusBadge type="role" value={c.role} />
                      </div>
                      <div className={styles.contactDetails}>
                        {c.email && (
                          <div className={styles.contactDetailRow}>
                            <Mail size={12} />
                            <span>{c.email}</span>
                          </div>
                        )}
                        {c.company && (
                          <div className={styles.contactDetailRow}>
                            <Building size={12} />
                            <span>{c.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Clients */}
            <div className="card">
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f472b6' }}>
                <Users size={16} />
                Clients / Customers ({clients.length})
              </h3>
              
              {clients.length === 0 ? (
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No clients registered.</p>
              ) : (
                <div className={styles.contactGrid}>
                  {clients.map((c) => (
                    <div key={c.id} className={styles.contactCard}>
                      <div className={styles.contactHeader}>
                        <span className={styles.contactName}>{c.name}</span>
                        <StatusBadge type="role" value={c.role} />
                      </div>
                      <div className={styles.contactDetails}>
                        {c.email && (
                          <div className={styles.contactDetailRow}>
                            <Mail size={12} />
                            <span>{c.email}</span>
                          </div>
                        )}
                        {c.company && (
                          <div className={styles.contactDetailRow}>
                            <Building size={12} />
                            <span>{c.company}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Contact form */}
          <div>
            <ContactForm />
          </div>
        </div>
      )}
    </div>
  );
}
