import { CONVERSATION_TYPE } from '@/constants';
import { ConversationMember } from './conversation_member';
import { ConversationSetting } from './conversation_setting';
import { Message } from './message';

export type CONVERSATION_TYPE = (typeof CONVERSATION_TYPE)[keyof typeof CONVERSATION_TYPE];

export interface Conversation {
  id: number;
  type: CONVERSATION_TYPE;
  key?: string | null;
  name: string | null;
  avatar: string | null;
  description?: string | null;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  last_message?: Message;
  is_archived?: boolean;
  members?: ConversationMember[];
  settings?: ConversationSetting;
  unread_count: number | 0;
  last_unread_message: Message | null;
}
