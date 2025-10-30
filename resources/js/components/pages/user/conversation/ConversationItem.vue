<script setup lang="ts">
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { Conversation } from '@/types/model';
import { getAvatarConversation, getNameConversation } from '@/utils/message';
import { AVATAR_DEFAULT } from '@/constants/imageConst';
import { CONVERSATION_TYPE } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { useChat } from '@/composables/useChat';
import { useChatStore } from '@/stores/chatStore';

const props = defineProps<{
  conversation: Conversation;
}>();

const chatStore = useChatStore();
const { closeChat, openChat } = useChat();

const handleSelectConversation = (conversation: Conversation) => {
  if (conversation.type === CONVERSATION_TYPE.DIRECT) {
    const member = conversation.members?.find((m) => m.user_id !== useAuthStore().user?.id);
    if (member) {
      openChat({ conversation: conversation, id: member.user_id });
    } else {
      closeChat();
    }
  } else {
    openChat({ conversation: conversation, id: conversation.id });
  }
};

const formatTime = (time: string) => format(new Date(time), 'HH:mm', { locale: vi });
</script>
<template>
  <div
    class="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200 mx-2 my-1"
    :class="{ 'bg-indigo-100 dark:bg-gray-700': chatStore.activeConversation?.id === conversation.id }"
    @click="handleSelectConversation(conversation)"
  >
    <!-- Avatar -->
    <div class="relative shrink-0">
      <img
        :src="getAvatarConversation(conversation) || AVATAR_DEFAULT"
        class="w-10 h-10 rounded-full shadow-sm border border-gray-200 dark:border-gray-800 object-cover"
      />
      <span v-if="true" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
    </div>

    <!-- Info -->
    <div class="flex-1 overflow-hidden">
      <p class="font-medium text-gray-800 dark:text-white truncate">
        {{ getNameConversation(conversation) }}
      </p>

      <p v-if="conversation.last_message?.content" class="text-sm text-gray-500 dark:text-gray-400 truncate">
        {{ conversation.last_message.content }}
      </p>
      <p v-else class="text-sm text-gray-400 italic">Nhắn tin ngay...</p>
    </div>

    <!-- Optional time -->
    <div v-if="conversation.last_message?.created_at" class="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap pl-1">
      {{ formatTime(conversation.last_message.created_at) }}
    </div>
  </div>
</template>
<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
div {
  animation: fadeIn 0.2s ease;
}
</style>
