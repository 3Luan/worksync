<script setup lang="ts">
import type { Conversation } from '@/types/model';
import { getNameConversation } from '@/utils/message';

const props = defineProps<{
  conversations: Conversation[];
  activeFriendId?: number | null;
}>();

const emit = defineEmits<{
  (e: 'select', conversation: Conversation): void;
}>();

const selectConversation = (c: Conversation) => emit('select', c);
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div
      v-for="conversation in conversations"
      :key="conversation.id"
      class="flex items-center gap-3 p-3 cursor-pointer rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all duration-200 mx-2 my-1"
      :class="{ 'bg-indigo-100 dark:bg-gray-700': activeFriendId === conversation.id }"
      @click="selectConversation(conversation)"
    >
      <div class="relative">
        <img :src="conversation.avatar || 'https://i.pravatar.cc/100?img=1'" class="w-10 h-10 rounded-full shadow-sm border border-gray-200" />
        <span v-if="true" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
      </div>
      <div class="flex-1">
        <p class="font-medium text-gray-800 dark:text-white truncate">{{ getNameConversation(conversation) }}</p>
        <p class="text-sm text-gray-500 truncate">Nhắn tin ngay...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.3);
  border-radius: 3px;
}
</style>
