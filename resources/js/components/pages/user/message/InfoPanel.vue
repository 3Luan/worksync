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
      <header
        class="h-16 flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-[#171717] z-10"
      >
        <div class="flex items-center gap-2">
          <ArrowLeft
            v-if="globalStore.isMobileView"
            class="w-5 h-5 cursor-pointer hover:text-indigo-500 transition-colors"
            @click="closePanelInfo"
          />
          <h1 class="font-semibold text-gray-800 dark:text-white">Thông tin đoạn chat</h1>
        </div>
        <X
          v-if="!globalStore.isMobileView"
          class="w-5 h-5 cursor-pointer hover:text-indigo-500 transition-colors"
          @click="closePanelInfo"
        />
      </header>

      <!-- Scrollable content -->
      <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        <!-- Avatar + name -->
        <section class="flex flex-col items-center text-center space-y-3">
          <img
            :src="getAvatarConversation(chatStore.activeConversation) || AVATAR_DEFAULT"
            class="w-20 h-20 rounded-full border shadow-sm object-cover"
          />
          <h3 class="font-semibold text-lg text-gray-800 dark:text-white">
            {{ getNameConversation(chatStore.activeConversation) }}
          </h3>
          <p class="text-sm text-gray-500">Đang hoạt động</p>
        </section>

        <!-- Options -->
        <section class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h2 class="font-semibold text-gray-700 dark:text-gray-200 mb-3">Tùy chọn</h2>
          <div class="space-y-2">
            <button
              class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Tắt thông báo
            </button>
            <button
              class="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-red-500"
            >
              Xóa đoạn chat
            </button>
          </div>
        </section>

        <!-- Recent Files -->
        <section class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h2 class="font-semibold text-gray-700 dark:text-gray-200 mb-3">Ảnh & file gần đây</h2>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="i in 8"
              :key="i"
              class="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400"
            >
              📷
            </div>
          </div>
        </section>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
/* Smooth slide-in transition */
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

/* Scrollbar styling */
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.3);
  border-radius: 3px;
}
</style>
