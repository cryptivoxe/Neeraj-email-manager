'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createContact } from './actions';
import { ContactRole } from '@prisma/client';
import { UserPlus, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<ContactRole>(ContactRole.EMPLOYEE);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Contact name is required.');
      return;
    }

    setLoading(true);
    const result = await createContact({
      name: name.trim(),
      email: email.trim() || undefined,
      company: company.trim() || undefined,
      role,
    });
    setLoading(false);

    if (result.success) {
      setSuccess(`Contact "${name}" created successfully!`);
      setName('');
      setEmail('');
      setCompany('');
      setRole(ContactRole.EMPLOYEE);
      router.refresh();
    } else {
      setError(result.error || 'Failed to create contact.');
    }
  };

  return (
    <div className="card">
      <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <UserPlus size={16} style={{ color: 'var(--accent)' }} />
        Add New Contact
      </h3>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-needs-action)', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ padding: '8px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-closed)', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {success}
          </div>
        )}

        <div className="form-group">
          <label>Full Name *</label>
          <input 
            type="text" 
            placeholder="e.g. Johnathan Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address (Optional)</label>
          <input 
            type="email" 
            placeholder="e.g. john@vendor.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Company / Department (Optional)</label>
          <input 
            type="text" 
            placeholder="e.g. Acme Logistics or Operations" 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Directory Classification (Role) *</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value as ContactRole)}
            required
          >
            <option value={ContactRole.EMPLOYEE}>Employee / Team Member</option>
            <option value={ContactRole.VENDOR}>Vendor / Partner Service</option>
            <option value={ContactRole.CLIENT}>Client / Customer Account</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={14} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              Creating...
            </>
          ) : (
            'Add Contact'
          )}
        </button>
      </form>
    </div>
  );
}
