import axios from '@/utils/axios';
import type { Conversation, ConversationSetting } from '@/types/model';

export const conversationAPI = {
  getList(params?: { type?: 'direct' | 'group'; search?: string; page?: number }) {
    return axios.get('conversations', { params });
  },

  create(data: { type: 'direct' | 'group'; name?: string; avatar_url?: string; description?: string; members: number[] }) {
    return axios.post('conversations', data);
  },

  getByID(conversationId: number) {
    return axios.get(`conversations/${conversationId}`);
  },

  update(conversationId: number, data: Partial<Conversation>) {
    return axios.put(`conversations/${conversationId}`, data);
  },

  delete(conversationId: number) {
    return axios.delete(`conversations/${conversationId}`);
  },

  restore(conversationId: number) {
    return axios.post(`conversations/${conversationId}/restore`);
  },

  getMembers(conversationId: number) {
    return axios.get(`conversations/${conversationId}/members`);
  },

  addMember(conversationId: number, data: { user_id: number; role?: string }) {
    return axios.post(`conversations/${conversationId}/add-member`, data);
  },

  removeMember(conversationId: number, data: { user_id: number }) {
    return axios.delete(`conversations/${conversationId}/remove-member`, { data });
  },

  getMyConversations(params?: { page?: number; type?: 'direct' | 'group' }) {
    return axios.get('conversations/my', { params });
  },

  pin(conversationId: number) {
    return axios.post(`conversations/${conversationId}/pin`);
  },

  mute(conversationId: number, data?: { minutes?: number }) {
    return axios.post(`conversations/${conversationId}/mute`, data);
  },

  unmute(conversationId: number) {
    return axios.post(`conversations/${conversationId}/unmute`);
  },

  getSettings(conversationId: number) {
    return axios.get(`conversations/${conversationId}/settings`);
  },

  updateSettings(conversationId: number, data: Partial<ConversationSetting>) {
    return axios.put(`conversations/${conversationId}/settings`, data);
  },
};
