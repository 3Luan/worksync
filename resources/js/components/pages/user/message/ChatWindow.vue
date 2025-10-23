<script setup lang="ts">
import { ref } from 'vue';
import ChatHeader from '@/components/pages/user/message/ChatHeader.vue';
import MessageList from '@/components/pages/user/message/MessageList.vue';
import MessageInput from '@/components/pages/user/message/MessageInput.vue';
import type { Conversation } from '@/types/model';
import type { Message } from '@/types/model';

const props = defineProps<{
  isMobile: boolean;
  activeFriend: Conversation | null;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'openInfo'): void;
}>();

const messageListRef = ref<InstanceType<typeof MessageList> | null>(null);

// Handle new message sent
const handleMessageSent = (message: Message) => {
  messageListRef.value?.addMessage(message);
};
</script>

<template>
  <section v-if="activeFriend" class="flex-1 flex flex-col bg-white dark:bg-[#171717]">
    <!-- Chat Header -->
    <ChatHeader :isMobile="isMobile" :activeFriend="activeFriend" @back="emit('back')" @openInfo="emit('openInfo')" />

    <!-- Message List -->
    <MessageList ref="messageListRef" :conversationId="activeFriend.id" class="chat-scroll" />

    <!-- Message Input -->
    <MessageInput :conversationId="activeFriend.id" @message-sent="handleMessageSent" />
  </section>
</template>
