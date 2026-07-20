'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import styles from '@/styles/layout.module.css';
import { Shield, X } from 'lucide-react';

type AppShellProps = {
  children: React.ReactNode;
  needsActionCount: number;
  waitingCount: number;
  currentUser: {
    name: string;
    email?: string;
    role?: string;
  };
};

export default function AppShell({
  children,
  needsActionCount,
  waitingCount,
  currentUser,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className={styles.layout}>
      <div
        className={`${styles.sidebarOverlay} ${
          sidebarOpen ? styles.sidebarOverlayVisible : ''
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`${styles.mobileSidebarWrapper} ${
          sidebarOpen ? styles.mobileSidebarWrapperOpen : ''
        }`}
      >
        <div className={styles.mobileSidebarHeader}>
          <div className={styles.mobileSidebarBrand}>
            <Shield size={18} style={{ color: 'var(--accent)' }} />
            <span>InboxTracker</span>
          </div>

          <button
            type="button"
            className={styles.closeMenuButton}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <Sidebar currentUser={currentUser} />
      </div>

      <div className={styles.desktopSidebar}>
        <Sidebar currentUser={currentUser} />
      </div>

      <div className={styles.main}>
        <div className={styles.mobileTopBar}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            ☰
          </button>

          <div className={styles.mobileBrand}>
            <Shield size={18} style={{ color: 'var(--accent)' }} />
            <span>InboxTracker</span>
          </div>
        </div>

        <Header
          needsActionCount={needsActionCount}
          waitingCount={waitingCount}
        />

        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}