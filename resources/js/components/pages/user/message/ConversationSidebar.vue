<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { conversationService } from '@/services/conversation-service';
import type { Conversation } from '@/types/model';
import ConversationSearch from './ConversationSearch.vue';
import ConversationList from './ConversationList.vue';

const router = useRouter();
const conversations = ref<Conversation[]>([]);
const filtered = ref<Conversation[]>([]);
const searchTerm = ref('');

const props = defineProps<{
  isMobile: boolean;
  isChatOpen: boolean;
  activeFriendId?: number | null;
}>();

const emit = defineEmits<{
  (e: 'update:isChatOpen', value: boolean): void;
  (e: 'selectConversation', conversation: Conversation): void;
}>();

// chọn đoạn chat
const selectFriend = (friend: Conversation) => {
  emit('selectConversation', friend);
  router.push(`/messages/${friend.id}`);
  if (props.isMobile) emit('update:isChatOpen', true);
};

// lấy danh sách
const fetchConversations = async () => {
  const res = await conversationService.getList();
  conversations.value = res.data.data || [];
  filtered.value = conversations.value;
};

// lọc theo từ khóa
const handleSearch = (query: string) => {
  searchTerm.value = query;
  if (!query) {
    filtered.value = conversations.value;
  } else {
    const lower = query.toLowerCase();
    filtered.value = conversations.value.filter((c) => (c.name ?? '').toLowerCase().includes(lower));
  }
};

onMounted(fetchConversations);
</script>

<template>
  <aside v-if="!isChatOpen || !isMobile" class="w-full md:w-1/4 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#171717]">
    <ConversationSearch @search="handleSearch" />

    <ConversationList :conversations="filtered" :activeFriendId="activeFriendId" @select="selectFriend" />
  </aside>
</template>
