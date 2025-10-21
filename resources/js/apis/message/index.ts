import axios from '@/utils/axios';
import type { Message, Attachment } from '@/types/model';

export const messageAPI = {
  getList(params?: { conversation_id?: number; page?: number; per_page?: number }) {
    return axios.get('messages', { params });
  },

  getByID(messageId: number) {
    return axios.get(`messages/${messageId}`);
  },

  create(data: { conversation_id: number; content: string; type: number; reply_to_id?: number | null; attachments?: Attachment[] }) {
    return axios.post('messages', data);
  },

  update(messageId: number, data: Partial<Message>) {
    return axios.put(`messages/${messageId}`, data);
  },

  delete(messageId: number) {
    return axios.delete(`messages/${messageId}`);
  },

  restore(messageId: number) {
    return axios.post(`messages/${messageId}/restore`);
  },

  react(messageId: number, data: { emoji: string }) {
    return axios.post(`messages/${messageId}/react`, data);
  },

  markAsRead(messageId: number) {
    return axios.post(`messages/${messageId}/read`);
  },

  uploadAttachment(formData: FormData) {
    return axios.post('attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
