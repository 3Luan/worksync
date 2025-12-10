import { MESSAGE_STATUS, MESSAGE_TYPE } from '@/constants';
import { Attachment } from './attachment';
import { MessageMention } from './message_mention';
import { MessageReaction } from './message_reaction';
import { MessageRead } from './message_read';
import { MessageVisibility } from './message_visibility';
import { User } from './user';

export type MessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];
export type MessageStatus = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export interface Message {
  id: number;
  conversation_id?: number;
  content: string | null;
  type: MessageType;
  reply_to_id: number | null;
  forwarded_from_id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  sender_id?: number;
  sender?: User;
  attachments?: Attachment[];
  reactions?: MessageReaction[];
  mentions?: MessageMention[];
  reads?: MessageRead[];
  visibility?: MessageVisibility[];
  status: MessageStatus;
}

export interface MessageGroupItem {
  message: Message;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  showTime: boolean;
  showDate: boolean;
}
