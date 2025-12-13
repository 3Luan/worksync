import { MessageStatus, MessageType } from '../model';
import type { PaginationParams, SortingType } from './common';

export interface CreateMessagePayload extends PaginationParams, SortingType {
  conversation_id: number;
  content: string;
  type: MessageType;
  status: MessageStatus;
}
