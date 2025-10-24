import { CONVERSATION_TYPE } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { Conversation } from '@/types/model';

export const getNameConversation = (conversation: Conversation): string => {
  if (conversation.type === CONVERSATION_TYPE.DIRECT && conversation.members) {
    const otherMember = conversation.members.find((m) => m.user_id !== useAuthStore().user?.id);
    return otherMember?.user?.name || '';
  }
  return conversation.name || '';
};

export const getAvatarConversation = (conversation: Conversation): string => {
  if (conversation.type === CONVERSATION_TYPE.DIRECT && conversation.members) {
    const otherMember = conversation.members.find((m) => m.user_id !== useAuthStore().user?.id);
    return otherMember?.user?.avatar || '';
  }
  return conversation.avatar || '';
};
