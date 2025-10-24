<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Conversation, ConversationMember, User } from '@/types/model';
import { conversationService } from '@/services/conversation-service';
import { userService } from '@/services/user-service';
import ConversationSidebar from '@/components/pages/user/message/ConversationSidebar.vue';
import ChatWindow from '@/components/pages/user/message/ChatWindow.vue';
import InfoPanel from '@/components/pages/user/message/InfoPanel.vue';
import { CONVERSATION_TYPE } from '@/constants';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const route = useRoute();

const conversations = ref<Conversation[]>([]);
const activeFriend = ref<Conversation | null>(null);
const showInfoPanel = ref(false);
const isChatOpen = ref(false);

const isMobile = computed(() => window.innerWidth < 768);

// ==========================
// 📦 FETCH CONVERSATIONS
// ==========================
const fetchConversations = async () => {
  try {
    const res = await conversationService.getList();
    conversations.value = res.data.data || [];
    await handleRouteChange(route.params.id);
  } catch (err) {
    console.error('Failed to fetch conversations:', err);
  }
};

// ==========================
// ⚙️ HANDLE ROUTE CHANGE
// ==========================
const handleRouteChange = async (newId: string | string[] | undefined) => {
  const userId = Number(newId);
  if (!userId) {
    activeFriend.value = null;
    isChatOpen.value = false;
    return;
  }

  // 1️⃣ Kiểm tra xem đã có conversation với user này chưa
  let existing = conversations.value.find((c) => c.type === CONVERSATION_TYPE.DIRECT && c.members?.some((m) => m.user_id === userId));

  if (existing) {
    activeFriend.value = existing;
    isChatOpen.value = true;
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
        id: 0, // ID ảo
        key: null,
        type: CONVERSATION_TYPE.DIRECT,
        name: user.name,
        avatar: user.avatar,
        last_message: null,
        is_archived: false,
        members: members,
      };

      conversations.value.unshift(fakeConversation);
      activeFriend.value = fakeConversation;
      isChatOpen.value = true;
    }
  } catch (err) {
    console.error('Failed to load user info for fake conversation:', err);
  }
};

const handleSelectConversation = (conversation: Conversation) => {
  if (conversation.type === CONVERSATION_TYPE.DIRECT) {
    const member = conversation.members?.find((m) => m.user_id !== useAuthStore().user?.id);
    if (member) {
      router.push(`/messages/${member.user_id}`);
    } else {
      goBackToList();
    }
  } else {
    router.push(`/messages/${conversation.key}`);
  }

  activeFriend.value = conversation;
  isChatOpen.value = true;
};

const goBackToList = () => {
  router.push('/messages');
  isChatOpen.value = false;
  activeFriend.value = null;
};

const handleConversationCreated = (conversation: Conversation) => {
  const index = conversations.value.findIndex((c) => c.id === 0);
  if (index !== -1) {
    conversations.value[index] = conversation;
  } else {
    conversations.value.unshift(conversation);
  }
};

watch(
  () => route.params.id,
  async (newId) => {
    await handleRouteChange(newId);
  },
);

onMounted(async () => {
  await fetchConversations();

  if (window.innerWidth >= 768) {
    isChatOpen.value = true;
  } else if (route.params.id) {
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
      :conversations="conversations"
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
      @conversation-created="handleConversationCreated"
    />

    <!-- Info Panel -->
    <InfoPanel :show="showInfoPanel" :isMobile="isMobile" :activeFriend="activeFriend" @close="showInfoPanel = false" />
  </div>
</template>
