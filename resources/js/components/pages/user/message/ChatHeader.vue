<script setup lang="ts">
import { Phone, Video, MoreVertical, ArrowLeft } from 'lucide-vue-next';
import type { Conversation } from '@/types/model';
import { getNameConversation } from '@/utils/message';

const props = defineProps<{
  isMobile: boolean;
  activeFriend: Conversation | null;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'openInfo'): void;
}>();
</script>

<template>
  <header v-if="activeFriend" class="h-16 flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f]">
    <div class="flex items-center gap-3">
      <ArrowLeft v-if="isMobile" class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="emit('back')" />
      <img :src="activeFriend.avatar || 'https://i.pravatar.cc/100?img=2'" class="w-10 h-10 rounded-full border" />
      <div>
        <h3 class="font-semibold text-gray-800 dark:text-white">{{ getNameConversation(activeFriend) }}</h3>
        <p class="text-xs text-gray-500">Đang hoạt động</p>
      </div>
    </div>

    <div class="flex gap-3 text-gray-600 dark:text-gray-400 items-center">
      <Phone class="w-5 h-5 cursor-pointer hover:text-indigo-500" />
      <Video class="w-5 h-5 cursor-pointer hover:text-indigo-500" />
      <MoreVertical class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="emit('openInfo')" />
    </div>
  </header>
</template>
