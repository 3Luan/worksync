import { Conversation } from './conversation';
import { User } from './user';

export interface ConversationInvitation {
  id: number;
  conversation_id: number;
  invited_by: number;
  invite_code: string;
  expired_at: string;
  created_at: string;
  updated_at: string;
  conversation?: Conversation;
  inviter?: User;
}
