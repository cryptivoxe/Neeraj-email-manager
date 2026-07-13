import React from 'react';
import NewEmailForm from './NewEmailForm';

export const revalidate = 0;

export default async function NewEmailPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">New Email Entry</h1>
          <p className="page-description">
            Manually add an email communication to log and track.
          </p>
        </div>
      </div>

      <NewEmailForm />
    </div>
  );
}