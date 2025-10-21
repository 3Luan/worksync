import { Attachment } from './attachment';
import { MessageMention } from './message_mention';
import { MessageReaction } from './message_reaction';
import { MessageRead } from './message_read';
import { MessageVisibility } from './message_visibility';
import { User } from './user';

export interface Message {
  id: number;
  conversation_id: number;
  content: string | null;
  type: 0 | 1 | 2 | 3 | 4 | 5; // 0: 'text', 1: 'image', 2: 'file', 3: 'video', 4: 'audio', 5: 'system';
  reply_to_id: number | null;
  forwarded_from_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sender_id: number;
  sender?: User;
  attachments?: Attachment[];
  reactions?: MessageReaction[];
  mentions?: MessageMention[];
  reads?: MessageRead[];
  visibility?: MessageVisibility[];
}
