<script setup lang="ts">
import ConversationSearch from './ConversationSearch.vue';
import ConversationList from './ConversationList.vue';
import { useChatStore } from '@/stores/chatStore';
import { useGlobalStore } from '@/stores/globalStore';
import { onMounted, onUnmounted } from 'vue';
import { conversationService } from '@/services/conversation-service';
import { MESSAGE_STATUS } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { useRoute } from 'vue-router';
import { useChannelStore } from '@/stores/channelStore';

const chatStore = useChatStore();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const channelStore = useChannelStore();
const route = useRoute();

let userChannel: any = null;

// Mark messages as delivered for specific conversation
const markMessagesAsDelivered = async (conversationId: number) => {
  if (!conversationId) return;
  await conversationService.markMessagesAsDelivered(conversationId);
  chatStore.updateMessageStatus(conversationId, MESSAGE_STATUS.DELIVERED);
  console.log('đã nhận:', conversationId);
};

// Mark all as delivered
const markAllMessagesAsDelivered = async () => {
  await conversationService.markAllMessagesAsDelivered();
  chatStore.updateMessageDeliveryStatusAllConversations();
  console.log('đã nhận all');
};

onMounted(async () => {
  await markAllMessagesAsDelivered();

  // Listen to user channel for incoming messages
  userChannel = channelStore.userChannel;

  if (!userChannel) {
    // If not exists (quick reload), join manually
    if (authStore.user) {
      const channelName = `user.${authStore.user.id}`;
      userChannel = channelStore.join(channelName);
    }
  }

  if (!userChannel) return;

  // Listen to messages sent to User
  userChannel.listen('.message.sent', async (event: any) => {
    if (route.path === '/messages') {
      console.log('message.sent for user:', event);

      chatStore.addMessageToConversation(event.message.conversation_id, event.message);
      await markMessagesAsDelivered(event.message.conversation_id);
    }
  });
});

onUnmounted(() => {
  if (authStore.user) {
    const channelName = `user.${authStore.user.id}`;
    channelStore.leave(channelName);
    console.log('Leave channel:', channelName);
  }
});
</script>

<template>
  <aside
    v-if="!chatStore.isChatOpen || !globalStore.isMobileView"
    class="w-full md:w-1/4 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#171717]"
  >
    <ConversationSearch />
    <ConversationList />
  </aside>
</template>
