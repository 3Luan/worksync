import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Conversation, Message, MessageStatus } from '@/types/model';
import { MESSAGE_STATUS } from '@/constants';

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
    if (activeConversation.value && activeConversation.value.id === message.conversation_id) {
      const updatedConversation: Conversation = {
        ...activeConversation.value,
        last_message: message,
      };

      activeConversation.value = updatedConversation;
      updateConversation(updatedConversation);
    }
  };

  // delivered
  // const markMessageAsDelivered = (messageId: number) => {
  //   const index = messages.value.findIndex((m) => m.id === messageId);
  //   if (index !== -1) {
  //     messages.value[index].status = MESSAGE_STATUS.DELIVERED;
  //   }
  // };

  // Replace a temporary message with the real one
  const replaceMessage = async (tempId: number, newMessage: Message) => {
    const index = messages.value.findIndex((m) => m.id === tempId);
    if (index !== -1) {
      messages.value[index] = newMessage;
    } else {
      messages.value.push(newMessage);
    }
  };

  const updateMessageStatus = (conversation_id: number, status: MessageStatus) => {
    // update full list messages of conversation to status
    messages.value = messages.value.map((message) => {
      if (message.conversation_id === conversation_id) {
        switch (message.status) {
          case MESSAGE_STATUS.DELIVERED:
            if (status === MESSAGE_STATUS.SEEN) {
              return {
                ...message,
                status,
              };
            }
            break;
          case MESSAGE_STATUS.SENT:
            if (status === MESSAGE_STATUS.DELIVERED && message.status === MESSAGE_STATUS.SENT) {
              return {
                ...message,
                status,
              };
            }
            break;
          case MESSAGE_STATUS.FAILED:
            break;

          default:
            break;
        }
      }
      return message;
    });
  };

  const updateMessageDeliveryStatusAllConversations = () => {
    // update full list messages of all conversations to status
    messages.value = messages.value.map((m) => {
      if (m.status === MESSAGE_STATUS.SENT) {
        return {
          ...m,
          status: MESSAGE_STATUS.DELIVERED,
        };
      }
      return m;
    });
  };

  // const addMessageToConversation = (conversationId: number, message: Message) => {
  //   console.log('Cập nhật tin nhắn cuối cùng trong cuộc hội thoại:', message);
  //   const conversation = conversations.value.find((c) => c.id === conversationId);
  //   if (conversation) {

  //     conversation.last_message = message;
  //     updateConversation(conversation);
  //   }
  // };

  const addMessageToConversation = (conversationId: number, message: Message) => {
    const index = conversations.value.findIndex((c) => c.id === conversationId);
    if (index !== -1) {
      conversations.value[index] = {
        ...conversations.value[index],
        last_message: message,
      };
      conversations.value = [...conversations.value];
    }
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
    replaceMessage,
    updateMessageStatus,
    addMessageToConversation,
    updateMessageDeliveryStatusAllConversations,
  };
});
