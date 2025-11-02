import type { PaginationParams, SortingType } from './common';

export interface CreateConversationParams extends PaginationParams, SortingType {
  title: string;
  participant_ids: number[];
}