import type { ApiResponse, CreateMessagePayload } from '@/types/api';
import { baseResponseApi } from '@/utils/api-utils';
import { $t } from '@/utils/i18n';
import { messageAPI } from '@/apis/message';
import type { Message } from '@/types/model';

export const messageService = {
  /**
   * Get messages (optionally filter by conversation_id)
   */
  async getList(params?: { conversation_id?: number; page?: number; per_page?: number }): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.getList(params), $t('common.fetchMessagesError'));
  },

  /**
   * Get a specific message
   */
  async getByID(messageId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.getByID(messageId), $t('common.fetchMessageError'));
  },

  /**
   * Send a new message
   */
  async create(data: CreateMessagePayload): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.create(data), $t('common.sendMessageError'));
  },

  /**
   * Update (edit) a message
   */
  async update(messageId: number, data: Partial<Message>): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.update(messageId, data), $t('common.updateMessageError'));
  },

  /**
   * Delete message
   */
  async delete(messageId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.delete(messageId), $t('common.deleteMessageError'));
  },

  /**
   * Restore deleted message
   */
  async restore(messageId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.restore(messageId), $t('common.restoreMessageError'));
  },

  /**
   * React to a message
   */
  async react(messageId: number, emoji: string): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.react(messageId, { emoji }), $t('common.reactMessageError'));
  },

  /**
   * Mark message as delivered
   */
  async markAsDelivered(messageId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.markAsDelivered(messageId), $t('common.markAsDeliveredError'));
  },

  /**
   * Mark message as seen
   */
  async markAsSeen(messageId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.markAsSeen(messageId), $t('common.markAsSeenError'));
  },

  /**
   * Upload attachment (optional)
   */
  async uploadAttachment(formData: FormData): Promise<ApiResponse<any>> {
    return baseResponseApi(() => messageAPI.uploadAttachment(formData), $t('common.uploadAttachmentError'));
  },
};
