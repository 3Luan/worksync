import { User } from './user';

export interface MessageRead {
  id: number;
  message_id: number;
  user_id: number;
  read_at: string;
  user?: User;
}
