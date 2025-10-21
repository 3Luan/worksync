import { ConversationMember } from './conversation_member';
import { ConversationSetting } from './conversation_setting';
import { Message } from './message';

export interface Conversation {
  id: number;
  type: 'direct' | 'group';
  name: string | null;
  avatar_url: string | null;
  description: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  last_message?: Message | null;
  members?: ConversationMember[];
  settings?: ConversationSetting;
}
