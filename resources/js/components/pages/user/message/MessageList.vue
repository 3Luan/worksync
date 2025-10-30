<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue';
import { messageService } from '@/services/message-service';
import MessageItem from './MessageItem.vue';
import MessageSkeleton from './MessageSkeleton.vue';
import { useChatStore } from '@/stores/chatStore';
import { useChat } from '@/composables/useChat';

const props = defineProps<{
  conversationId: number | null;
}>();

const chatStore = useChatStore();
const { scrollToBottom } = useChat();

const loadingOlder = ref(false);
const hasMore = ref(true);
const page = ref(1);
const chatContainer = ref<HTMLDivElement | null>(null);
const initialLoading = ref(true);

// Get messages
const fetchMessages = async (loadMore = false) => {
  if (!props.conversationId) return;
  if (loadingOlder.value || (!hasMore.value && loadMore)) return;

  if (!loadMore) initialLoading.value = true;
  loadingOlder.value = true;

  const res = await messageService.getList({
    conversation_id: props.conversationId,
    page: page.value,
    per_page: 20,
  });

  const newMsgs = res.data.data.reverse();
  const el = chatContainer.value;
  const oldHeight = el?.scrollHeight || 0;

  if (loadMore) {
    chatStore.setMessages([...newMsgs, ...chatStore.messages]);
    await nextTick();
    if (el) el.scrollTop = el.scrollHeight - oldHeight;
  } else {
    chatStore.setMessages(newMsgs);
    await nextTick();
    scrollToBottom({ container: chatContainer.value, instant: true });
  }

  if (!res.data.next_page_url) hasMore.value = false;
  loadingOlder.value = false;
  initialLoading.value = false;
};

// Scroll to load older
const handleScroll = async (e: Event) => {
  const el = e.target as HTMLElement;
  if (el.scrollTop <= 100 && hasMore.value && !loadingOlder.value) {
    page.value++;
    await fetchMessages(true);
  }
};

watch(
  () => props.conversationId,
  async (newId) => {
    if (newId) {
      page.value = 1;
      hasMore.value = true;
      chatStore.setMessages([]);
      await fetchMessages();
    } else {
      chatStore.setMessages([]);
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (props.conversationId) fetchMessages();
});
</script>

<template>
  <main ref="chatContainer" class="chat-scroll-container flex-1 overflow-y-auto p-4 space-y-3" @scroll.passive="handleScroll">
    <div v-if="initialLoading" class="space-y-4">
      <MessageSkeleton v-for="i in 10" :key="i" />
    </div>

    <div v-else>
      <div v-if="loadingOlder" class="flex justify-center my-3">
        <div class="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-2xl shadow-sm">
          <span class="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span class="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span class="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
        </div>
      </div>
      <transition-group name="fade-up" tag="div" class="space-y-1" appear>
        <MessageItem v-for="message in chatStore.messages" :key="message.id" :message="message" />
      </transition-group>
    </div>
  </main>
</template>
<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
