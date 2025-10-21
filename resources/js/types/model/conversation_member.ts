import { User } from './user';

export interface ConversationMember {
  id: number;
  conversation_id: number;
  user_id: number;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
  is_pinned?: boolean;
  muted_until?: string | null;
  user?: User;
}
