<script setup lang="ts">
import { Phone, Video, MoreVertical, ArrowLeft } from 'lucide-vue-next';
import { getAvatarConversation, getNameConversation } from '@/utils/message';
import { AVATAR_DEFAULT } from '@/constants/imageConst';
import { useGlobalStore } from '@/stores/globalStore';
import { useChatStore } from '@/stores/chatStore';
import { useChat } from '@/composables/useChat';

const globalStore = useGlobalStore();
const chatStore = useChatStore();
const { closeChat, openPanelInfo } = useChat();
</script>

<template>
  <header
    v-if="chatStore.activeConversation"
    class="h-16 flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f]"
  >
    <div class="flex items-center gap-3">
      <ArrowLeft
        v-if="globalStore.isMobileView"
        class="w-5 h-5 cursor-pointer hover:text-indigo-500"
        @click="closeChat()"
      />
      <img
        :src="getAvatarConversation(chatStore.activeConversation) || AVATAR_DEFAULT"
        class="w-10 h-10 rounded-full border"
      />
      <div>
        <h3 class="font-semibold text-gray-800 dark:text-white">
          {{ getNameConversation(chatStore.activeConversation) }}
        </h3>
        <p class="text-xs text-gray-500">Đang hoạt động</p>
      </div>
    </div>

    <div class="flex gap-3 text-gray-600 dark:text-gray-400 items-center">
      <Phone class="w-5 h-5 cursor-pointer hover:text-indigo-500" />
      <Video class="w-5 h-5 cursor-pointer hover:text-indigo-500" />
      <MoreVertical class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="openPanelInfo" />
    </div>
  </header>
</template>
