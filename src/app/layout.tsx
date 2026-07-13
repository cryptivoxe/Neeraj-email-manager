import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { db } from '@/lib/db';
import styles from '@/styles/layout.module.css';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Manager Email Tracker',
  description: 'Enterprise email tracking dashboard for high-volume managers.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let needsActionCount = 0;
  let waitingCount = 0;

  let currentUser: {
    name: string;
    email?: string;
    role?: string;
  } = {
    name: 'Neeraj Kumar',
    email: 'neeraj.kumar@company.com',
    role: 'MANAGER',
  };

  try {
    needsActionCount = await db.email.count({
      where: { status: 'NEEDS_ACTION' },
    });

    waitingCount = await db.email.count({
      where: { status: 'WAITING_REPLY' },
    });

    const firstUser = await db.user.findFirst();

    if (firstUser) {
      currentUser = {
        name: firstUser.name || 'Neeraj Kumar',
        email: firstUser.email || undefined,
        role: firstUser.role || undefined,
      };
    }
  } catch (e) {
    console.warn(
      'Prisma not fully initialized or seeded yet. Using fallback values for counts.'
    );
  }

  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className={styles.layout}>
          <Sidebar currentUser={currentUser} />
          <div className={styles.main}>
            <Suspense fallback={<header className={styles.header}>Loading...</header>}>
              <Header
                needsActionCount={needsActionCount}
                waitingCount={waitingCount}
              />
            </Suspense>
            <div className={styles.content}>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}