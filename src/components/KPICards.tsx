import React from 'react';
import { 
  AlertCircle, 
  Clock, 
  Send, 
  CheckCircle2, 
  CalendarX 
} from 'lucide-react';
import styles from '../styles/components.module.css';

interface KPICardsProps {
  needsActionCount: number;
  waitingCount: number;
  forwardedCount: number;
  closedCount: number;
  overdueCount: number;
}

export default function KPICards({
  needsActionCount,
  waitingCount,
  forwardedCount,
  closedCount,
  overdueCount,
}: KPICardsProps) {
  const cards = [
    {
      label: 'Needs Action',
      value: needsActionCount,
      icon: AlertCircle,
      class: styles.kpiNeedsAction,
    },
    {
      label: 'Waiting Reply',
      value: waitingCount,
      icon: Clock,
      class: styles.kpiWaitingReply,
    },
    {
      label: 'Forwarded',
      value: forwardedCount,
      icon: Send,
      class: styles.kpiForwarded,
    },
    {
      label: 'Closed',
      value: closedCount,
      icon: CheckCircle2,
      class: styles.kpiClosed,
    },
    {
      label: 'Overdue',
      value: overdueCount,
      icon: CalendarX,
      class: styles.kpiOverdue,
    },
  ];

  return (
    <div className={styles.kpiGrid}>
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className={`${styles.kpiCard} ${card.class}`}>
            <div className={styles.kpiInfo}>
              <span className={styles.kpiLabel}>{card.label}</span>
              <span className={styles.kpiValue}>{card.value}</span>
            </div>
            <div className={styles.kpiIconWrapper}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
