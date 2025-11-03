<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Conversation, ConversationMember, User } from '@/types/model';
import { conversationService } from '@/services/conversation-service';
import { userService } from '@/services/user-service';
import ConversationSidebar from '@/components/pages/user/conversation/ConversationSidebar.vue';
import ChatWindow from '@/components/pages/user/message/ChatWindow.vue';
import InfoPanel from '@/components/pages/user/message/InfoPanel.vue';
import { CONVERSATION_TYPE, MESSAGE_STATUS } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import ChatEmpty from '@/components/pages/user/message/ChatEmpty.vue';
import { useGlobalStore } from '@/stores/globalStore';
import { useChatStore } from '@/stores/chatStore';
import { getEcho } from '@/echo';

const route = useRoute();
const globalStore = useGlobalStore();
const chatStore = useChatStore();
const echo = getEcho();

// Get conversations
const fetchConversations = async () => {
  try {
    const res = await conversationService.getList();
    chatStore.setConversations(res.data.data);
    await handleRouteChange(route.params.id);
  } catch (err) {
    console.error('Failed to fetch conversations:', err);
  }
};

// Handle route change
const handleRouteChange = async (newId: string | string[] | undefined) => {
  const userId = Number(newId);
  if (!userId) {
    chatStore.activeConversation = null;
    chatStore.isChatOpen = false;
    return;
  }

  // Check if conversation with this user already exists
  let existing = chatStore.conversations.find((c) => c.type === CONVERSATION_TYPE.DIRECT && c.members?.some((m) => m.user_id === userId));

  if (existing) {
    chatStore.activeConversation = existing;
    chatStore.isChatOpen = true;
    return;
  }

  try {
    const userRes = await userService.getUser({ userId });
    const user = userRes.data as User;
    const authUser = useAuthStore().user;

    const members = [
      { user_id: user.id, user },
      { user_id: authUser?.id, user: authUser },
    ] as ConversationMember[];

    if (authUser?.id) {
      const fakeConversation: Conversation = {
        id: 0, // temporary ID
        key: null,
        type: CONVERSATION_TYPE.DIRECT,
        name: user.name,
        avatar: user.avatar,
        // last_message: null,
        is_archived: false,
        members: members,
      };

      chatStore.conversations.unshift(fakeConversation);
      chatStore.activeConversation = fakeConversation;
      chatStore.isChatOpen = true;
    }
  } catch (err) {
    console.error('Failed to load user info for fake conversation:', err);
  }
};

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

watch(
  () => route.params.id,
  async (newId) => {
    await handleRouteChange(newId);
  },
);

onMounted(async () => {
  await fetchConversations();
  await markAllMessagesAsDelivered();
  const authStore = useAuthStore();

  if(echo){
    const userChannel = echo.private(`user.${authStore.user?.id}`);

    // Lắng nghe khi có tin nhắn mới ở bất kỳ conversation nào
    userChannel.listen('.message.sent', async (event: any) => {
      console.log('Có tin nhắn mới gửi tới bạn:', event);
      chatStore.addMessageToConversation(event.message.conversation_id, event.message);
      await markMessagesAsDelivered(event.message.conversation_id);
    });
  }
  

  if (window.innerWidth >= 768) {
    chatStore.isChatOpen = true;
  } else if (route.params.id) {
    chatStore.isChatOpen = true;
  }

  window.addEventListener('resize', () => {
    const hasId = !!route.params.id;
    if (window.innerWidth >= 768) {
      chatStore.isChatOpen = true;
    } else {
      chatStore.isChatOpen = hasId;
    }
  });
});
</script>

<template>
  <div class="flex h-[calc(100vh-56px)] bg-gray-50 dark:bg-[#171717] rounded-lg overflow-hidden relative">
    <!-- Sidebar -->
    <ConversationSidebar />

    <!-- Chat Window -->
    <ChatWindow v-if="chatStore.activeConversation && (chatStore.isChatOpen || !globalStore.isMobileView)" />

    <!-- Empty State -->
    <ChatEmpty v-if="!chatStore.activeConversation && (chatStore.isChatOpen || !globalStore.isMobileView)" />

    <!-- Info Panel -->
    <InfoPanel />
  </div>
</template>
