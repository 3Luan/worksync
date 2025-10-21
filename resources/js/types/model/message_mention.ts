import { User } from './user';

export interface MessageMention {
  id: number;
  message_id: number;
  mentioned_user_id: number;
  created_at: string;
  user?: User;
}
