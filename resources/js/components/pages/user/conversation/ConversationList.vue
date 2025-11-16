<script setup lang="ts">
import ConversationItem from './ConversationItem.vue';
import { useChatStore } from '@/stores/chatStore';

const chatStore = useChatStore();
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <ConversationItem
      v-for="conversation in chatStore.conversations"
      :key="conversation.id"
      :conversation="conversation"
      :activeId="chatStore.activeConversation?.id"
    />
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
