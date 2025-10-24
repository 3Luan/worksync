<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import type { Conversation } from '@/types/model';
import ConversationSearch from './ConversationSearch.vue';
import ConversationList from './ConversationList.vue';

const props = defineProps<{
  isMobile: boolean;
  isChatOpen: boolean;
  activeFriendId?: number | null;
  conversations: Conversation[]; // ✅ nhận từ cha
}>();

const emit = defineEmits<{
  (e: 'update:isChatOpen', value: boolean): void;
  (e: 'selectConversation', conversation: Conversation): void;
}>();

const searchTerm = ref('');
const filtered = ref<Conversation[]>([]);

// ✅ Khi props.conversations thay đổi → cập nhật filtered
watch(
  () => props.conversations,
  (val) => {
    filtered.value = val || [];
  },
  { immediate: true },
);

// ✅ Tìm kiếm
const handleSearch = (query: string) => {
  searchTerm.value = query;
  if (!query) {
    filtered.value = props.conversations;
  } else {
    const lower = query.toLowerCase();
    filtered.value = props.conversations.filter((c) => (c.name ?? '').toLowerCase().includes(lower));
  }
};

// ✅ Chọn conversation
const selectFriend = (friend: Conversation) => {
  emit('selectConversation', friend);
  if (props.isMobile) emit('update:isChatOpen', true);
};
</script>

<template>
  <aside v-if="!isChatOpen || !isMobile" class="w-full md:w-1/4 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#171717]">
    <ConversationSearch @search="handleSearch" />
    <ConversationList :conversations="filtered" :activeFriendId="activeFriendId" @select="selectFriend" />
  </aside>
</template>
