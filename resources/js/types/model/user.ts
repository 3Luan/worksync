import { ROLE, USER_PRESENCE, USER_STATUS } from '@/constants';

export type UserRole = (typeof ROLE)[keyof typeof ROLE];
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
export type UserPresence = (typeof USER_PRESENCE)[keyof typeof USER_PRESENCE];

export interface User {
  id: number;
  name: string;
  username: string;
  avatar: string | null;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  presence: UserPresence;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
