<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import type { Message } from '@/types/model';
import { useAuthStore } from '@/stores/authStore';
import { messageService } from '@/services/message-service';

const props = defineProps<{
  conversationId: number | null;
}>();

const emit = defineEmits<{
  (e: 'scroll-bottom'): void;
}>();

const messages = ref<Message[]>([]);
const loadingOlder = ref(false);
const hasMore = ref(true);
const page = ref(1);
const chatContainer = ref<HTMLDivElement | null>(null);

// Get messages
const fetchMessages = async (loadMore = false) => {
  if (!props.conversationId) return;
  if (loadingOlder.value || (!hasMore.value && loadMore)) return;

  loadingOlder.value = true;
  const res = await messageService.getList({
    conversation_id: props.conversationId,
    page: page.value,
    per_page: 10,
  });

  const newMsgs = res.data.data.reverse();
  const el = chatContainer.value;
  const oldHeight = el?.scrollHeight || 0;

  if (loadMore) {
    messages.value = [...newMsgs, ...messages.value];
    await nextTick();
    if (el) el.scrollTop = el.scrollHeight - oldHeight;
  } else {
    messages.value = newMsgs;
    await nextTick();
    scrollToBottom({ instant: true });
  }

  if (!res.data.next_page_url) hasMore.value = false;
  loadingOlder.value = false;
};

// Scroll to bottom
const scrollToBottom = ({ instant = false } = {}) => {
  const el = chatContainer.value;
  if (!el) return;

  requestAnimationFrame(() => {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: instant ? 'auto' : 'smooth',
    });
  });
  emit('scroll-bottom');
};

// Handle scroll to load older messages
const handleScroll = async (e: Event) => {
  const el = e.target as HTMLElement;
  if (el.scrollTop <= 100 && hasMore.value && !loadingOlder.value) {
    page.value++;
    await fetchMessages(true);
  }
};

// Add a new message
const addMessage = async (msg: Message) => {
  messages.value.push(msg);
  await nextTick();
  scrollToBottom();
};

// Expose addMessage method to parent
defineExpose({ addMessage });

watch(
  () => props.conversationId,
  async (newId) => {
    if (newId) {
      page.value = 1;
      hasMore.value = true;
      messages.value = [];
      await fetchMessages();
    } else {
      messages.value = [];
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (props.conversationId) fetchMessages();
});
</script>

<template>
  <main ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-3" @scroll.passive="handleScroll">
    <div v-if="loadingOlder" class="text-center text-sm text-gray-400 mb-2">Đang tải tin nhắn cũ...</div>

    <transition-group name="fade-up" tag="div" class="space-y-1">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'max-w-[70%] px-4 py-2 rounded-2xl text-sm',
          message.sender_id === useAuthStore().user?.id
            ? 'ml-auto bg-indigo-500 text-white'
            : 'bg-white dark:bg-[#171717] border border-gray-200 dark:border-gray-700',
        ]"
      >
        {{ message.content }}
      </div>
    </transition-group>
  </main>
</template>
