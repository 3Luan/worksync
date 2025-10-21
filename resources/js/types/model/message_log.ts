import { User } from './user';

export interface MessageLog {
  id: number;
  message_id: number;
  action: 'create' | 'edit' | 'delete' | 'restore' | 'react';
  user_id: number;
  metadata?: Record<string, any>;
  created_at: string;
  user?: User;
}
