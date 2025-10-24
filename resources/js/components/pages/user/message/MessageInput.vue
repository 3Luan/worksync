<script setup lang="ts">
import { ref } from 'vue';
import { Send, Smile } from 'lucide-vue-next';
import { messageService } from '@/services/message-service';
import type { Conversation, Message } from '@/types/model';
import { conversationService } from '@/services/conversation-service';
import { CONVERSATION_TYPE } from '@/constants';

const props = defineProps<{
  conversation: Conversation | null;
}>();

const emit = defineEmits<{
  (e: 'message-sent', message: Message): void;
  // create conversation if not exist
  (e: 'conversation-created', conversation: Conversation): void;
}>();

const input = ref('');

// Send message
const sendMessage = async () => {
  let conversationKey = props.conversation?.key || null;
  let conversationId = props.conversation?.id;

  if (!conversationKey) {
    const response = await conversationService.create({
      type: CONVERSATION_TYPE.DIRECT,
      members: props.conversation?.members?.map((member) => member.user_id) || [],
    });

    emit('conversation-created', response.data);
    conversationId = response.data.id;
  }

  if (!input.value.trim() || !conversationId) return;

  const res = await messageService.create({
    conversation_id: conversationId,
    content: input.value,
    type: CONVERSATION_TYPE.DIRECT,
  });

  const newMessage = res.data;
  emit('message-sent', newMessage);
  input.value = '';
};
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
