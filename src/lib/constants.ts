export const EMAIL_STATUS = {
  NEEDS_ACTION: 'NEEDS_ACTION',
  WIP: 'WIP',
  WAITING_REPLY: 'WAITING_REPLY',
  FORWARDED: 'FORWARDED',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED',
} as const;

export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export const CONTACT_ROLE = {
  EMPLOYEE: 'EMPLOYEE',
  VENDOR: 'VENDOR',
  CLIENT: 'CLIENT',
} as const;

export const ACTION_TYPE = {
  REPLY: 'REPLY',
  FORWARD: 'FORWARD',
  ASSIGN: 'ASSIGN',
  FOLLOW_UP: 'FOLLOW_UP',
  CLOSE: 'CLOSE',
  NOTE: 'NOTE',
} as const;

export type EmailStatus = typeof EMAIL_STATUS[keyof typeof EMAIL_STATUS];
export type Priority = typeof PRIORITY[keyof typeof PRIORITY];
export type ContactRole = typeof CONTACT_ROLE[keyof typeof CONTACT_ROLE];
export type ActionType = typeof ACTION_TYPE[keyof typeof ACTION_TYPE];