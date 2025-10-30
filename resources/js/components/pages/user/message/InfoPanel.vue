<script setup lang="ts">
import { X, ArrowLeft } from 'lucide-vue-next';
import { useGlobalStore } from '@/stores/globalStore';
import { useChatStore } from '@/stores/chatStore';
import { useChat } from '@/composables/useChat';
import { getAvatarConversation, getNameConversation } from '@/utils/message';
import { AVATAR_DEFAULT } from '@/constants/imageConst';

const globalStore = useGlobalStore();
const chatStore = useChatStore();
const { closePanelInfo } = useChat();
</script>

<template>
  <transition name="">
    <aside
      v-if="chatStore.isPanelInfoOpen && chatStore.activeConversation"
      class="absolute md:static right-0 top-0 h-full w-full md:w-1/4 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-[#171717] flex flex-col z-20"
    >
      <!-- Header -->
      <div class="h-16 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-2">
          <ArrowLeft v-if="globalStore.isMobileView" class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="closePanelInfo" />
          <h1 class="font-semibold text-gray-800 dark:text-white">Thông tin đoạn chat</h1>
        </div>
        <X v-if="!globalStore.isMobileView" class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="closePanelInfo" />
      </div>

      <!-- Content -->
      <div class="flex flex-col items-center text-center p-6 space-y-3">
        <img :src="getAvatarConversation(chatStore.activeConversation) || AVATAR_DEFAULT" class="w-20 h-20 rounded-full border shadow-sm" />
        <h3 class="font-semibold text-lg text-gray-800 dark:text-white">
          {{ getNameConversation(chatStore.activeConversation) }}
        </h3>
        <p class="text-sm text-gray-500">Đang hoạt động</p>
      </div>

      <div class="px-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
        <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p class="font-semibold mb-2">Tùy chọn</p>
          <button class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Tắt thông báo</button>
          <button class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition">Xóa đoạn chat</button>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
          <p class="font-semibold mb-2">Ảnh & file gần đây</p>
          <div class="flex gap-2 flex-wrap">
            <div v-for="i in 4" :key="i" class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">📷</div>
          </div>
        </div>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
