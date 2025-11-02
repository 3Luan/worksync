<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { Send, Smile } from 'lucide-vue-next';
import { messageService } from '@/services/message-service';
import type { Conversation, Message } from '@/types/model';
import { conversationService } from '@/services/conversation-service';
import { CONVERSATION_TYPE, MESSAGE_STATUS, MESSAGE_TYPE } from '@/constants';
import { useChatStore } from '@/stores/chatStore';
import { useChat } from '@/composables/useChat';
import { CreateMessagePayload } from '@/types/api';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps<{
  conversation: Conversation | null;
}>();

const chatStore = useChatStore();
const authStore = useAuthStore();
const { scrollToBottom } = useChat();

const input = ref('');

// Send message
const sendMessage = async () => {
  let conversationKey = props.conversation?.key || null;
  let conversationId = props.conversation?.id;

  if (!input.value.trim()) return;

  // 🔹 Nếu chưa có conversation, tạo mới
  if (!conversationKey) {
    const response = await conversationService.create({
      type: CONVERSATION_TYPE.DIRECT,
      members: props.conversation?.members?.map((m) => m.user_id) || [],
    });
    conversationId = response.data.id;
    if (conversationId) {
      await chatStore.replaceTemporaryConversation(response.data);
    }
  }

  if (!conversationId) return;

  // 1️⃣ Tạo message tạm (trạng thái "đang gửi")
  const tempId = Date.now(); // number
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

  // Cuộn xuống dưới cùng
  await nextTick();
  const container = document.querySelector('.chat-scroll-container') as HTMLDivElement;
  scrollToBottom({ container });

  // 2️⃣ Gửi message thật qua API
  try {
    const payload : CreateMessagePayload = {
      conversation_id: conversationId,
      content: input.value,
      type: MESSAGE_TYPE.TEXT,
      status: MESSAGE_STATUS.SENT,
    };

    const res = await messageService.create(payload);

    const newMessage = {
      ...res.data,
      status: MESSAGE_STATUS.SENT,
    };

    // 3️⃣ Thay tin tạm bằng tin thật (chuyển sang "đã gửi")
    setTimeout(() => {
      chatStore.replaceMessage(tempId, newMessage);
    }, 300);

  } catch (error) {
    console.log(error);
    
    // 4️⃣ Nếu lỗi → chuyển sang "LỖI"
    chatStore.replaceMessage(tempId, {
      ...tempMessage,
      status: MESSAGE_STATUS.FAILED,
    });
  } finally {
    // Dọn input
    input.value = '';
  }
};

onMounted(() => {
  if (!props.conversation?.id) return;

  const channelName = `conversation.${props.conversation.id}`;
  const channel = window.Echo.private(channelName);

  // 📨 Khi nhận được tin nhắn mới từ người khác
  channel.listen('.message.sent', async (event: any)  => {
    const message = event.message;

    // Nếu là tin mình gửi thì bỏ qua (vì đã hiển thị local)
    if (message.sender_id === authStore.user?.id) return;

    console.log("đã tới", message);
    
    chatStore.addMessage(message);
    await conversationService.markMessagesAsDelivered(props.conversation!.id);
    chatStore.addMessageToConversation(message.conversation_id, message);

    // Cuộn xuống cuối cùng
    nextTick(() => {
      const container = document.querySelector('.chat-scroll-container') as HTMLDivElement;
      scrollToBottom({ container });
    });
  });

  // deli
  channel.listen('.message.delivered', (event: any) => {
    setTimeout(() => {
      console.log('A đã nhận', event);
      chatStore.updateMessageStatus(event.conversation_id, MESSAGE_STATUS.DELIVERED);
    }, 1000);
  });

  // Khi có event "message.seen"
  channel.listen('.message.seen', (event: any) => {
    if(event.user_id === authStore.user?.id) return;
    setTimeout(() => {
      console.log("A đã xem", event);
      chatStore.updateMessageStatus(event.conversation_id, MESSAGE_STATUS.SEEN);
    }, 1000);
  });

  // ⚠️ Khi có event "message.failed"
  channel.listen('.message.failed', (event: any) => {
    console.log('Gửi thất bại', event);
    chatStore.updateMessageStatus(event.conversation_id, MESSAGE_STATUS.FAILED);
  });
});

onUnmounted(() => {
  if (props.conversation?.id) {
    const channelName = `conversation.${props.conversation.id}`;
    window.Echo.leave(channelName);
  }
});

</script>

<template>
  <footer class="p-3 bg-white dark:bg-[#1f1f1f] border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 sticky bottom-0">
    <button class="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 transition">
      <Smile class="w-5 h-5 text-gray-600 dark:text-gray-300" />
    </button>
    <input
      v-model="input"
      type="text"
      placeholder="Nhập tin nhắn..."
      class="flex-1 p-2.5 rounded-xl border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-[#171717] dark:text-white transition"
      @keyup.enter="sendMessage"
    />
    <button class="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 shadow" @click="sendMessage">
      <Send class="w-5 h-5" />
    </button>
  </footer>
</template>
