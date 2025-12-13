<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { Send, Smile } from 'lucide-vue-next';
import { messageService } from '@/services/message-service';
import type { Conversation, Message } from '@/types/model';
import { conversationService } from '@/services/conversation-service';
import { CONVERSATION_TYPE, MESSAGE_STATUS, MESSAGE_TYPE } from '@/constants';
import { useChatStore } from '@/stores/chatStore';
import { useChat } from '@/composables/useChat';
import { CreateMessagePayload } from '@/types/api';
import { useAuthStore } from '@/stores/authStore';
import { useChannelStore } from '@/stores/channelStore';
import EmojiPicker from '../emoji/EmojiPicker.vue';

const props = defineProps<{
  conversation: Conversation | null;
}>();

const chatStore = useChatStore();
const authStore = useAuthStore();
const channelStore = useChannelStore();
const { scrollToBottom } = useChat();
const inputRef = ref<HTMLInputElement | null>(null);
const input = ref('');

// Channel reference
let channel: any = null;

// Insert emoji at cursor position
const insertEmoji = (emoji: string) => {
  if (!inputRef.value) return;

  const element = inputRef.value;
  const start = element.selectionStart ?? input.value.length;
  const end = element.selectionEnd ?? input.value.length;
  input.value = input.value.slice(0, start) + emoji + input.value.slice(end);

  nextTick(() => {
    const pos = start + emoji.length;
    element.setSelectionRange(pos, pos);
    element.focus();
  });
};

// Join channel and setup listeners
const setupChannel = () => {
  if (!props.conversation?.id) return;

  const channelName = `conversation.${props.conversation.id}`;
  channel = channelStore.join(channelName);

  if (!channel) return;

  // message.sent
  channel.listen('.message.sent', async (event: any) => {
    const message = event.message;

    // Ignore if sent by myself
    if (message.sender_id === authStore.user?.id) return;

    chatStore.addMessage(message);
    await conversationService.markMessagesAsDelivered(props.conversation!.id);
    chatStore.addMessageToConversation(message.conversation_id, message);

    nextTick(() => {
      const container = document.querySelector('.chat-scroll-container') as HTMLDivElement;
      scrollToBottom({ container });
    });
  });

  // message.delivered
  channel.listen('.message.delivered', (event: any) => {
    setTimeout(() => {
      chatStore.updateMessageStatus(event.conversation_id, MESSAGE_STATUS.DELIVERED);
    }, 1000);
  });

  // message.seen
  channel.listen('.message.seen', (event: any) => {
    if (event.user_id === authStore.user?.id) return;
    if (event.conversation_id !== props.conversation?.id) return;

    setTimeout(() => {
      chatStore.updateMessageStatus(event.conversation_id, MESSAGE_STATUS.SEEN);
      chatStore.updateConversationUnread(event.conversation_id);
    }, 1500);
  });

  // message.failed
  channel.listen('.message.failed', (event: any) => {
    chatStore.updateMessageStatus(event.conversation_id, MESSAGE_STATUS.FAILED);
  });
};

// Cleanup channel
const cleanupChannel = () => {
  if (!props.conversation?.id) return;

  const channelName = `conversation.${props.conversation.id}`;
  channelStore.leave(channelName);
  channel = null;
};

// Send message
const sendMessage = async () => {
  if (!input.value.trim()) return;

  let conversationId = props.conversation?.id;

  // Create conversation if not exists
  if (!conversationId) {
    const response = await conversationService.create({
      type: CONVERSATION_TYPE.DIRECT,
      members: props.conversation?.members?.map((m) => m.user_id) || [],
    });

    conversationId = response.data.id;

    await chatStore.replaceTemporaryConversation(response.data);
  }

  if (!conversationId) return;

  // Temporary message
  const tempId = Date.now();
  const tempMessage: Message = {
    id: tempId,
    conversation_id: conversationId,
    sender_id: authStore.user?.id,
    content: input.value,
    type: MESSAGE_TYPE.TEXT,
    status: MESSAGE_STATUS.SENDING,
    created_at: new Date().toISOString(),
    sender: authStore?.user || undefined,
    reply_to_id: null,
    forwarded_from_id: null,
    updated_at: new Date().toISOString(),
    deleted_at: null,
    attachments: [],
    reactions: [],
    mentions: [],
    reads: [],
    visibility: [],
  };

  chatStore.addMessage(tempMessage);

  // Scroll to bottom
  await nextTick();
  const container = document.querySelector('.chat-scroll-container') as HTMLDivElement;
  requestAnimationFrame(() => {
    scrollToBottom({ container });
  });

  // Send real message
  try {
    const payload: CreateMessagePayload = {
      conversation_id: conversationId,
      content: input.value,
      type: MESSAGE_TYPE.TEXT,
      status: MESSAGE_STATUS.SENT,
    };

    const res = await messageService.create(payload);

    chatStore.replaceMessage(tempId, {
      ...res.data,
      status: MESSAGE_STATUS.SENT,
    });
  } catch (error) {
    chatStore.replaceMessage(tempId, { ...tempMessage, status: MESSAGE_STATUS.FAILED });
  }

  input.value = '';
};

// Watch conversation change
watch(
  () => props.conversation?.id,
  () => {
    cleanupChannel();
    setupChannel();
  },
);

// On mounted
onMounted(setupChannel);

// On unmounted
onUnmounted(cleanupChannel);
</script>

<template>
  <footer
    class="p-3 bg-white dark:bg-[#1f1f1f] border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 sticky bottom-0"
  >
    <!-- Emoji -->
    <EmojiPicker @select="insertEmoji" />

    <!-- Input -->
    <input
      ref="inputRef"
      v-model="input"
      @keyup.enter="sendMessage"
      placeholder="Nhập tin nhắn..."
      class="flex-1 p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-[#171717] dark:text-white transition"
    />

    <!-- Send -->
    <button
      @click="sendMessage"
      class="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 shadow"
    >
      <Send class="w-5 h-5" />
    </button>
  </footer>
</template>
