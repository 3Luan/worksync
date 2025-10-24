import type { ApiResponse } from '@/types/api';
import { baseResponseApi } from '@/utils/api-utils';
import { $t } from '@/utils/i18n';
import { conversationAPI } from '@/apis/conversation';
import type { Conversation, CONVERSATION_TYPE, ConversationSetting } from '@/types/model';

export const conversationService = {
  /**
   * Get paginated list of conversations
   */
  async getList(params?: { type: CONVERSATION_TYPE; search?: string; page?: number }): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.getList(params), $t('common.fetchConversationsError'));
  },

  /**
   * Get single conversation by ID
   */
  async getByID(conversationId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.getByID(conversationId), $t('common.fetchConversationError'));
  },

  /**
   * Create a new conversation
   */
  async create(data: { type: CONVERSATION_TYPE; name?: string; avatar?: string; description?: string; members: number[] }): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.create(data), $t('common.createConversationError'));
  },

  /**
   * Update conversation info (name, description, avatar)
   */
  async update(conversationId: number, data: Partial<Conversation>): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.update(conversationId, data), $t('common.updateConversationError'));
  },

  /**
   * Delete (archive) conversation
   */
  async delete(conversationId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.delete(conversationId), $t('common.deleteConversationError'));
  },

  /**
   * Restore a deleted conversation
   */
  async restore(conversationId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.restore(conversationId), $t('common.restoreConversationError'));
  },

  /**
   * Get members of a conversation
   */
  async getMembers(conversationId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.getMembers(conversationId), $t('common.fetchConversationMembersError'));
  },

  /**
   * Add member to group chat
   */
  async addMember(conversationId: number, data: { user_id: number; role?: string }): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.addMember(conversationId, data), $t('common.addMemberError'));
  },

  /**
   * Remove member from group chat
   */
  async removeMember(conversationId: number, data: { user_id: number }): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.removeMember(conversationId, data), $t('common.removeMemberError'));
  },

  /**
   * Get my conversations (for current logged user)
   */
  async getMyConversations(params?: { page?: number; type?: CONVERSATION_TYPE }): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.getMyConversations(params), $t('common.fetchMyConversationsError'));
  },

  /**
   * Pin a conversation
   */
  async pin(conversationId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.pin(conversationId), $t('common.pinConversationError'));
  },

  /**
   * Mute a conversation
   */
  async mute(conversationId: number, minutes?: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.mute(conversationId, { minutes }), $t('common.muteConversationError'));
  },

  /**
   * Unmute a conversation
   */
  async unmute(conversationId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.unmute(conversationId), $t('common.unmuteConversationError'));
  },

  /**
   * Get conversation settings
   */
  async getSettings(conversationId: number): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.getSettings(conversationId), $t('common.fetchConversationSettingsError'));
  },

  /**
   * Update conversation settings
   */
  async updateSettings(conversationId: number, data: Partial<ConversationSetting>): Promise<ApiResponse<any>> {
    return baseResponseApi(() => conversationAPI.updateSettings(conversationId, data), $t('common.updateConversationSettingsError'));
  },
};
