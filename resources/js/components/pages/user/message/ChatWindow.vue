<script setup lang="ts">
import ChatHeader from '@/components/pages/user/message/ChatHeader.vue';
import MessageList from '@/components/pages/user/message/MessageList.vue';
import ChatInput from '@/components/pages/user/message/ChatInput.vue';
import type { Conversation } from '@/types/model';
import { useChatStore } from '@/stores/chatStore';

const emit = defineEmits<{
  (e: 'conversation-created', conversation: Conversation): void;
}>();

const chatStore = useChatStore();

</script>

<template>
  <section v-if="chatStore.activeConversation" class="flex-1 flex flex-col bg-white dark:bg-[#171717]">
    <!-- Chat Header -->
    <ChatHeader />

    <!-- Message List -->
    <MessageList ref="messageListRef" :conversationId="chatStore.activeConversation.id" class="chat-scroll" />

    <!-- Message Input -->
    <ChatInput :conversation="chatStore.activeConversation" />
  </section>
</template>
