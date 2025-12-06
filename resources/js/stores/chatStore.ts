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
    if (activeConversation.value && activeConversation.value.id === message.conversation_id) {
      messages.value.push(message);

      const updatedConversation: Conversation = {
        ...activeConversation.value,
        last_message: message,
      };

      activeConversation.value = updatedConversation;
      updateConversation(updatedConversation);
    }
  };

  // const addMessage = async (message: Message) => {
  // // Chỉ thêm tin nhắn nếu nó thuộc cuộc hội thoại đang mở
  // if (activeConversation.value && message.conversation_id === activeConversation.value.id) {
  //   messages.value.push(message);
  // }

  // // Luôn cập nhật last_message cho conversation tương ứng
  // const index = conversations.value.findIndex((c) => c.id === message.conversation_id);
  //   if (index !== -1) {
  //     conversations.value[index] = {
  //       ...conversations.value[index],
  //       last_message: message,
  //     };
  //     conversations.value = [...conversations.value];
  //   }

  //   // Nếu conversation đang mở chính là conversation nhận message
  //   if (activeConversation.value?.id === message.conversation_id) {
  //     if (activeConversation.value) {
  //       const updated: Conversation = {
  //         ...activeConversation.value,
  //         last_message: message,
  //       };
  //       activeConversation.value = updated;
  //     }
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

  // Update message status in a conversation
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

  // Update all messages with SENT status to DELIVERED
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

  // Add message to conversation's last_message and increment unread_count
  const addMessageToConversation = (conversationId: number, message: Message) => {
    const index = conversations.value.findIndex((c) => c.id === conversationId);
    if (index !== -1) {
      conversations.value[index] = {
        ...conversations.value[index],
        last_message: message,
        unread_count: conversations.value[index].unread_count + 1,
      };
      conversations.value = [...conversations.value];
    }
  };

  // Update the unread count 0 anhd last_unread_message of a conversation
  const updateConversationUnread = (conversationId: number) => {
    const index = conversations.value.findIndex((c) => c.id === conversationId);
    if (index !== -1) {
      conversations.value[index] = {
        ...conversations.value[index],
        unread_count: 0,
        last_unread_message: null,
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
    updateConversationUnread,
  };
});
