import { Message } from './message';
import { User } from './user';

export interface PinnedMessage {
  id: number;
  conversation_id: number;
  message_id: number;
  pinned_by: number;
  created_at: string;
  message?: Message;
  user?: User;
}
