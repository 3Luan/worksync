import { useRouter } from 'vue-router';
import { useChatStore } from '@/stores/chatStore';
import type { Conversation } from '@/types/model';

export function useChat() {
  const router = useRouter();
  const chatStore = useChatStore();

  const openChat = ({ conversation, id }: { conversation: Conversation; id: number }) => {
    router.push(`/messages/${id}`);
    chatStore.activeConversation = conversation;
    chatStore.isChatOpen = true;
  };

  const closeChat = () => {
    router.push('/messages');
    chatStore.isChatOpen = false;
    chatStore.activeConversation = null;
  };

  const openPanelInfo = () => {
    chatStore.isPanelInfoOpen = true;
  };

  const closePanelInfo = () => {
    chatStore.isPanelInfoOpen = false;
  };

  const updateConversation = (conversation: Conversation) => {
    const index = chatStore.conversations.findIndex((c) => c.id === conversation.id);
    if (index !== -1) chatStore.conversations.splice(index, 1);
    chatStore.conversations.unshift(conversation);
  };

  const setConversations = (list: Conversation[]) => {
    chatStore.conversations = list;
  };

  const scrollToBottom = ({ container, instant = false }: { container: HTMLDivElement | null; instant?: boolean }) => {
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: instant ? 'auto' : 'smooth',
      });
    });
  };

  return {
    openChat,
    closeChat,
    openPanelInfo,
    closePanelInfo,
    updateConversation,
    setConversations,
    scrollToBottom,
  };
}
