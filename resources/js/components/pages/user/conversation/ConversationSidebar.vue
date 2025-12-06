<script setup lang="ts">
import ConversationSearch from './ConversationSearch.vue';
import ConversationList from './ConversationList.vue';
import { useChatStore } from '@/stores/chatStore';
import { useGlobalStore } from '@/stores/globalStore';
import { onMounted, onUnmounted, watch } from 'vue';
import { conversationService } from '@/services/conversation-service';
import { MESSAGE_STATUS } from '@/constants';
import { getEcho } from '@/echo';
import { useAuthStore } from '@/stores/authStore';
import { useRoute } from 'vue-router';
import { useChannelStore } from '@/stores/channelStore';

const chatStore = useChatStore();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const channelStore = useChannelStore();

const route = useRoute();
const echo = getEcho();
let userChannel: any = null;

const markMessagesAsDelivered = async (conversationId: number) => {
  if (!conversationId) return;
  await conversationService.markMessagesAsDelivered(conversationId);
  chatStore.updateMessageStatus(conversationId, MESSAGE_STATUS.DELIVERED);
  console.log('đã nhận: ', conversationId);
};

// all
const markAllMessagesAsDelivered = async () => {
  await conversationService.markAllMessagesAsDelivered();
  chatStore.updateMessageDeliveryStatusAllConversations();
  console.log('đã nhận all');
};

onMounted( async () => {
  markAllMessagesAsDelivered();

  if (echo) {
    userChannel = channelStore.userChannel;

    // Listen for event message.sent for user
    userChannel.listen('.message.sent', async (event: any) => {
      if(route.path === '/messages') {
        console.log('message.sent for user:', event);
        chatStore.addMessageToConversation(event.message.conversation_id, event.message);
        await markMessagesAsDelivered(event.message.conversation_id);
      }
    });
  }
});

onUnmounted(() => {
  if (userChannel && echo) {
    const channelName = `user.${authStore.user?.id}`;
    console.log("Leave channel: ", channelName);
    echo.leave(channelName);
  }
});
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
