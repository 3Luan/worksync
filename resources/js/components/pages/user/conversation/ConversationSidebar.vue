<script setup lang="ts">
import ConversationSearch from './ConversationSearch.vue';
import ConversationList from './ConversationList.vue';
import { useChatStore } from '@/stores/chatStore';
import { useGlobalStore } from '@/stores/globalStore';

const chatStore = useChatStore();
const globalStore = useGlobalStore();
</script>

<template>
  <aside
    v-if="!chatStore.isChatOpen || !globalStore.isMobileView"
    class="w-full md:w-1/4 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#171717]"
  >
    <!-- Search Bar -->
    <ConversationSearch />

    <!-- Conversation List -->
    <ConversationList />
  </aside>
</template>
