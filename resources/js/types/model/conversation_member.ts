import { CONVERSATION_MEMBER_ROLE } from '@/constants';
import { User } from './user';

export type ConversationMemberRole =
  (typeof CONVERSATION_MEMBER_ROLE)[keyof typeof CONVERSATION_MEMBER_ROLE];

export interface ConversationMember {
  id?: number;
  conversation_id?: number;
  user_id: number;
  role?: ConversationMemberRole;
  joined_at?: string;
  is_pinned?: boolean;
  muted_until?: string | null;
  user?: User;
}
