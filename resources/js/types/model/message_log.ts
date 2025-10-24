import { MESSAGE_LOG_ACTION } from '@/constants';
import { User } from './user';

export type MESSAGE_LOG_ACTION = (typeof MESSAGE_LOG_ACTION)[keyof typeof MESSAGE_LOG_ACTION];

export interface MessageLog {
  id: number;
  message_id: number;
  action: MESSAGE_LOG_ACTION;
  user_id: number;
  metadata?: Record<string, any>;
  created_at: string;
  user?: User;
}
