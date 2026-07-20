'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Mail,
  PlusCircle,
  BarChart3,
  Settings,
  Shield,
} from 'lucide-react';
import styles from '../styles/layout.module.css';

interface SidebarProps {
  currentUser?: {
    name: string;
    email?: string;
    role?: string;
  };
}

export default function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();

  const user = currentUser ?? {
    name: 'Neeraj Kumar',
    email: 'neeraj.kumar@company.com',
    role: 'MANAGER',
  };

  const navItems = [
    { label: 'All Emails', href: '/emails', icon: Mail },
    { label: 'New Email', href: '/emails/new', icon: PlusCircle },
    { label: 'Reports & Export', href: '/reports', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <Shield
          size={20}
          className={styles.brandIcon}
          style={{ color: 'var(--accent)' }}
        />
        <span>InboxTracker</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${
                isActive ? styles.activeNavLink : ''
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.profile}>
        <div className={styles.avatar}>
          {user.name
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>

        <div className={styles.profileInfo}>
          <span className={styles.profileName}>{user.name}</span>
          {user.role ? (
            <span className={styles.profileRole}>{user.role}</span>
          ) : null}
        </div>
      </div>
    </aside>
  );
}