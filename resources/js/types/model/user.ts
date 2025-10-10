import { ROLE, USER_STATUS } from '@/constants';

export type UserRole = (typeof ROLE)[keyof typeof ROLE];
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
