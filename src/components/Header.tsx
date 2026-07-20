'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, AlertCircle, Clock } from 'lucide-react';
import styles from '../styles/layout.module.css';

interface HeaderProps {
  needsActionCount?: number;
  waitingCount?: number;
}

export default function Header({
  needsActionCount = 0,
  waitingCount = 0,
}: HeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (search.trim()) {
      router.push(`/emails?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/emails');
    }
  };

  return (
    <header className={styles.header}>
      <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search subject, sender, vendor..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className={styles.headerActions}>
        {needsActionCount > 0 && (
          <div className={styles.headerStat}>
            <AlertCircle
              size={16}
              style={{ color: 'var(--status-needs-action)' }}
            />
            <span>Needs Action:</span>
            <span
              className={styles.headerStatValue}
              style={{ color: 'var(--status-needs-action)' }}
            >
              {needsActionCount}
            </span>
          </div>
        )}

        {waitingCount > 0 && (
          <div className={styles.headerStat}>
            <Clock
              size={16}
              style={{ color: 'var(--status-waiting-reply)' }}
            />
            <span>Waiting Reply:</span>
            <span
              className={styles.headerStatValue}
              style={{ color: 'var(--status-waiting-reply)' }}
            >
              {waitingCount}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}