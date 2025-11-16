import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Conversation, Message } from '@/types/model';

export const useChatStore = defineStore('chat', () => {
  // --- State ---
  const conversations = ref<Conversation[]>([]);
  const activeConversation = ref<Conversation | null>(null);
  const messages = ref<Message[]>([]);
  const isChatOpen = ref(false);
  const isPanelInfoOpen = ref(false);

  // --- Actions ---
  // Set the list of conversations
  const setConversations = (list: Conversation[]) => {
    conversations.value = list;
  };

  // Replace a temporary conversation with a real one
  const replaceTemporaryConversation = (conversation: Conversation) => {
    const existing = conversations.value.findIndex((c) => c.id === 0 || c.key === conversation.key);

    if (existing !== -1) {
      conversations.value[existing] = conversation;
    } else {
      conversations.value.unshift(conversation);
    }

    // Set as active if the temporary conversation was active
    if (activeConversation.value?.id === 0) {
      activeConversation.value = conversation;
    }
  };

  // Update a conversation
  const updateConversation = (updated: Conversation) => {
    const existing = conversations.value.findIndex((c) => c.id === updated.id);
    if (existing !== -1) conversations.value.splice(existing, 1);
    conversations.value.unshift(updated);
  };

  // Set the active conversation
  const setActiveConversation = (conversation: Conversation | null) => {
    activeConversation.value = conversation;
    messages.value = [];
  };

  // Set the list of messages
  const setMessages = (list: Message[]) => {
    messages.value = list;
  };

  // Add a new message
  const addMessage = async (message: Message) => {
    messages.value.push(message);

    if (activeConversation.value?.id === message.conversation_id) {
      activeConversation.value = {
        ...activeConversation.value,
        last_message: message,
      };
    }
    updateConversation(activeConversation.value as Conversation);
  };

  return {
    conversations,
    activeConversation,
    messages,
    isChatOpen,
    isPanelInfoOpen,
    setConversations,
    setActiveConversation,
    setMessages,
    addMessage,
    updateConversation,
    replaceTemporaryConversation,
  };
});
