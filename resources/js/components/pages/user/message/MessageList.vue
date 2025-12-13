<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue';
import { messageService } from '@/services/message-service';
import { useChatStore } from '@/stores/chatStore';
import { useChat } from '@/composables/useChat';
import { format, isToday, isYesterday } from 'date-fns';
import MessageItem from './MessageItem.vue';
import { MessageGroupItem } from '@/types/model';
import { conversationService } from '@/services/conversation-service';
import { useAuthStore } from '@/stores/authStore';
import { useRoute } from 'vue-router';
import { MESSAGE_STATUS } from '@/constants';
import { useChannelStore } from '@/stores/channelStore';

// Props
const props = defineProps<{ conversationId: number | null }>();

// Store & composables
const chatStore = useChatStore();
const authStore = useAuthStore();
const route = useRoute();
const channelStore = useChannelStore();
const { scrollToBottom } = useChat();

// Refs
const chatContainer = ref<HTMLDivElement | null>(null);
const loadingOlder = ref(false);
const hasMore = ref(true);
const page = ref(1);
const initialLoading = ref(true);

let userChannel: any = null;

// Computed
const messageIds = computed(() => chatStore.messages.map((message) => message.id));

// Helpers format date/time
const formatMessageTime = (date: string | Date) => format(new Date(date), 'HH:mm');
const formatMessageDate = (date: string | Date) => {
  const d = new Date(date);
  if (isToday(d)) return 'Hôm nay';
  if (isYesterday(d)) return 'Hôm qua';
  return format(d, 'dd/MM/yyyy');
};

// Fetch messages
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

// Scroll top to load older messages
const handleScroll = async (e: Event) => {
  const el = e.target as HTMLElement;
  if (el.scrollTop <= 100 && hasMore.value && !loadingOlder.value) {
    page.value++;
    await fetchMessages(true);
  }
};

// Grouped messages
const groupedMessages = computed(() => {
  const msgs = chatStore.messages;
  const result: Array<MessageGroupItem> = [];

  let lastDate = '';

  for (let i = 0; i < msgs.length; i++) {
    const msg = msgs[i];
    const msgDate = formatMessageDate(msg.created_at);
    const showDate = msgDate !== lastDate;
    lastDate = msgDate;

    const prev = msgs[i - 1];
    const next = msgs[i + 1];

    const sameAsPrev =
      prev &&
      prev.sender_id === msg.sender_id &&
      formatMessageDate(prev.created_at) === msgDate &&
      (new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime()) / 1000 / 60 < 10;

    const sameAsNext =
      next &&
      next.sender_id === msg.sender_id &&
      formatMessageDate(next.created_at) === msgDate &&
      (new Date(next.created_at).getTime() - new Date(msg.created_at).getTime()) / 1000 / 60 < 10;

    const isFirstInGroup = !sameAsPrev;
    const isLastInGroup = !sameAsNext;

    // Show time if the previous message is >= 10 minutes ago
    let showTime = false;
    if (i === 0) {
      showTime = true;
    } else {
      const prevTime = new Date(msgs[i - 1].created_at).getTime();
      const currTime = new Date(msg.created_at).getTime();
      const diff = (currTime - prevTime) / 1000 / 60;
      if (diff >= 10) showTime = true;
    }

    result.push({ message: msg, showDate, showTime, isFirstInGroup, isLastInGroup });
  }

  return result;
});

// Mark messages as seen
const markMessagesAsSeen = async () => {
  if (!props.conversationId) return;
  await conversationService.markMessagesAsSeen(props.conversationId);
};

// Watch messageIds to mark as seen
watch(messageIds, (newIds, oldIds) => {
  if (!props.conversationId) return;

  const activeConvId = chatStore.activeConversation?.id;
  if (activeConvId !== props.conversationId) return;

  if (newIds.length > oldIds.length) {
    markMessagesAsSeen();
  }
});

// Watch conversation change
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

const markMessagesAsDelivered = async (conversationId: number) => {
  if (!conversationId) return;
  await conversationService.markMessagesAsDelivered(conversationId);
  chatStore.updateMessageStatus(conversationId, MESSAGE_STATUS.DELIVERED);
  console.log('đã nhận: ', conversationId);
};

// On mounted: Join user channel using useChannelStore
onMounted(() => {
  if (props.conversationId) {
    chatStore.updateConversationUnread(props.conversationId);
  }

  // userChannel auto init trong store → just get it
  userChannel = channelStore.userChannel;

  // Join user channel if not joined
  if (!userChannel && authStore.user) {
    const channelName = `user.${authStore.user.id}`;
    userChannel = channelStore.join(channelName);
  }

  if (!userChannel) return;

  userChannel.listen('.message.sent', async (event: any) => {
    if (route.params?.id && props.conversationId !== event.message.conversation_id) {
      console.log('message.sent for user:', event);
      chatStore.addMessageToConversation(event.message.conversation_id, event.message);
      await markMessagesAsDelivered(event.message.conversation_id);
    }
  });
});
</script>

<template>
  <main
    ref="chatContainer"
    class="chat-scroll-container flex-1 overflow-y-auto p-4 space-y-3"
    @scroll.passive="handleScroll"
  >
    <!-- Loading -->

    <div>
      <!-- Messages -->
      <div v-for="item in groupedMessages" :key="item.message.id">
        <div v-if="item.showDate" class="text-center text-gray-500 dark:text-gray-400 my-2 text-sm">
          {{ formatMessageDate(item.message.created_at) }}
        </div>

        <div v-if="item.showTime" class="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
          {{ formatMessageTime(item.message.created_at) }}
        </div>

        <MessageItem :messageGroup="item" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.chat-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.chat-scroll-container::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.3);
  border-radius: 3px;
}
</style>
