<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Conversation } from '@/types/model';
import { conversationService } from '@/services/conversation-service';
import ConversationSidebar from '@/components/pages/user/message/ConversationSidebar.vue';
import ChatWindow from '@/components/pages/user/message/ChatWindow.vue';
import InfoPanel from '@/components/pages/user/message/InfoPanel.vue';

const router = useRouter();
const route = useRoute();

const conversations = ref<Conversation[]>([]);
const activeFriend = ref<Conversation | null>(null);
const showInfoPanel = ref(false);
const isChatOpen = ref(false);

const isMobile = computed(() => window.innerWidth < 768);

// Get conversations and set active friend if route has id
const fetchConversations = async () => {
  try {
    const res = await conversationService.getList();
    conversations.value = res.data.data || [];

    const id = Number(route.params.id);
    if (id) {
      const selected = conversations.value.find((c) => c.id === id);
      if (selected) {
        activeFriend.value = selected;
        isChatOpen.value = true;
      }
    }
  } catch (err) {
    console.error('Failed to fetch conversations:', err);
  }
};

// Handle selecting a conversation from sidebar
const handleSelectConversation = (conversation: Conversation) => {
  activeFriend.value = conversation;
  router.push(`/messages/${conversation.id}`);
  isChatOpen.value = true;
};

const goBackToList = () => {
  router.push('/messages');
  isChatOpen.value = false;
  activeFriend.value = null;
};

// Watch for route changes to update active friend
watch(
  () => route.params.id,
  (newId) => {
    const id = Number(newId);
    if (id && conversations.value.length > 0) {
      const selected = conversations.value.find((c) => c.id === id);
      activeFriend.value = selected || null;
      if (selected) isChatOpen.value = true;
    } else {
      activeFriend.value = null;
    }
  },
);

onMounted(async () => {
  await fetchConversations();

  const id = Number(route.params.id);

  if (window.innerWidth >= 768) {
    isChatOpen.value = true;
  } else if (id) {
    isChatOpen.value = true;
  }

  window.addEventListener('resize', () => {
    const hasId = !!route.params.id;
    if (window.innerWidth >= 768) {
      isChatOpen.value = true;
    } else {
      isChatOpen.value = hasId;
    }
  });
});
</script>

<template>
  <div class="flex h-[calc(100vh-56px)] bg-gray-50 dark:bg-[#171717] rounded-lg overflow-hidden relative">
    <!-- Sidebar -->
    <ConversationSidebar
      :isMobile="isMobile"
      :isChatOpen="isChatOpen"
      :activeFriendId="activeFriend?.id"
      @update:isChatOpen="isChatOpen = $event"
      @selectConversation="handleSelectConversation"
    />

    <!-- Chat Window -->
    <ChatWindow
      v-if="activeFriend && (isChatOpen || !isMobile)"
      :isMobile="isMobile"
      :activeFriend="activeFriend"
      @openInfo="showInfoPanel = true"
      @back="goBackToList"
    />

    <!-- Info Panel -->
    <InfoPanel :show="showInfoPanel" :isMobile="isMobile" :activeFriend="activeFriend" @close="showInfoPanel = false" />
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
