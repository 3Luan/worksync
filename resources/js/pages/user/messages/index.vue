<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, Send, Smile, Phone, Video, MoreVertical, X, ArrowLeft } from 'lucide-vue-next';
import { conversationService } from '@/services/conversation-service';
import { messageService } from '@/services/message-service';
import type { Conversation, Message } from '@/types/model';
import { useAuthStore } from '@/stores/authStore';

const conversations = ref<Conversation[]>([]);
const messages = ref<Message[]>([]);
const activeFriend = ref<Conversation | null>(null);
const input = ref('');
const showInfoPanel = ref(false);
const isChatOpen = ref(false);
const loadingOlder = ref(false);
const hasMore = ref(true);
const page = ref(1);

const router = useRouter();
const route = useRoute();
const isMobile = computed(() => window.innerWidth < 768);

const chatContainer = ref<HTMLDivElement | null>(null);

// ---------------- FETCH CONVERSATIONS ----------------
const fetchConversations = async () => {
  const response = await conversationService.getList();
  conversations.value = response.data.data;

  const id = Number(route.params.id);
  if (id) {
    const selected = conversations.value.find((c) => c.id === id);
    if (selected) {
      activeFriend.value = selected;
      if (isMobile.value) isChatOpen.value = true;
      await nextTick();
      await fetchMessages(id);
    }
  }
};

// ---------------- FETCH MESSAGES ----------------
const fetchMessages = async (conversationId: number, loadMore = false) => {
  if (loadingOlder.value || !hasMore.value) return;

  loadingOlder.value = true;

  const res = await messageService.getList({
    conversation_id: conversationId,
    page: page.value,
    per_page: 10,
    sort: 'desc',
  });

  const newMsgs = res.data.data.reverse();

  const el = chatContainer.value;
  const oldHeight = el?.scrollHeight || 0;

  if (loadMore) {
    messages.value = [...newMsgs, ...messages.value];
    await nextTick();
    if (el) {
      const newHeight = el.scrollHeight;
      el.scrollTop = newHeight - oldHeight;
    }
  } else {
    messages.value = newMsgs;
    await nextTick();
    scrollToBottom();
  }

  if (!res.data.next_page_url) hasMore.value = false;

  loadingOlder.value = false;
};

// ---------------- SEND MESSAGE ----------------
const sendMessage = async () => {
  if (!input.value.trim() || !activeFriend.value) return;

  const res = await messageService.create({
    conversation_id: activeFriend.value.id,
    content: input.value,
    type: 0,
  });

  messages.value.push(res.data);
  input.value = '';

  await nextTick();
  scrollToBottom();
};

// ---------------- SELECT FRIEND ----------------
const selectFriend = async (friend: Conversation) => {
  router.push(`/messages/${friend.id}`);
};

// ---------------- SCROLL HANDLING ----------------
const scrollToBottom = (opts?: { smooth?: boolean; force?: boolean }) => {
  const el = chatContainer.value;
  if (!el) return;

  const doScroll = (smooth: boolean) => {
    // Lần 1: cuộn ngay
    el.scrollTop = el.scrollHeight;
    if (smooth) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    } else {
      el.scrollTop = el.scrollHeight;
    }

    // Lần 2: đợi layout frame tiếp theo
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
      if (smooth) {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } else {
        el.scrollTop = el.scrollHeight;
      }

      // Lần 3: safety sau 0ms (khi có async content)
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 0);
    });
  };

  // Nếu force=true: dùng cuộn “auto” để đảm bảo xuống đáy tuyệt đối
  const smooth = opts?.smooth ?? true;
  const force = opts?.force ?? false;

  if (force) {
    doScroll(false); // auto trước cho chắc
  }
  doScroll(smooth);
};
const handleScroll = async (e: Event) => {
  const el = e.target as HTMLElement;
  if (el.scrollTop <= 1 && !loadingOlder.value && hasMore.value && activeFriend.value) {
    page.value++;
    await fetchMessages(activeFriend.value.id, true);
  }
};

// ---------------- WATCH ROUTE CHANGE ----------------
watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) {
      activeFriend.value = null;
      messages.value = [];
      return;
    }

    const id = Number(newId);
    const selected = conversations.value.find((c) => c.id === id);
    if (selected) {
      activeFriend.value = selected;
      page.value = 1;
      hasMore.value = true;
      if (isMobile.value) isChatOpen.value = true;
      await nextTick();
      await fetchMessages(id);
    }
  },
  { immediate: true },
);

// ---------------- AUTO SCROLL ON NEW MESSAGE ----------------
watch(
  () => messages.value.length,
  async () => {
    await nextTick();
    if (!loadingOlder.value) scrollToBottom();
  },
);

// ---------------- GO BACK (MOBILE) ----------------
const goBackToList = () => {
  router.push('/messages');
  isChatOpen.value = false;
  activeFriend.value = null;
};

// ---------------- RESIZE HANDLER ----------------
window.addEventListener('resize', () => {
  isChatOpen.value = window.innerWidth >= 768;
});

onMounted(fetchConversations);
</script>

<template>
  <div class="flex h-[calc(100vh-56px)] bg-[#FAFAFA] dark:bg-[#171717] rounded-lg overflow-hidden relative">
    <!-- SIDEBAR -->
    <aside v-if="!isChatOpen || !isMobile" class="w-full md:w-1/4 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#171717]">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="font-bold text-lg">Tin nhắn</h2>
        <Search class="w-5 h-5 text-gray-500" />
      </div>

      <div class="flex-1 overflow-y-auto">
        <div
          v-for="conversation in conversations"
          :key="conversation.id"
          class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          :class="{ 'bg-indigo-100 dark:bg-gray-700': activeFriend?.id === conversation.id }"
          @click="selectFriend(conversation)"
        >
          <div class="relative">
            <img :src="conversation.avatar_url || 'https://i.pravatar.cc/100?img=1'" class="w-10 h-10 rounded-full" />
            <span v-if="true" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ conversation.name }}</p>
            <p class="text-sm text-gray-500">Nhắn tin ngay...</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- CHAT MAIN -->
    <section v-if="activeFriend && (isChatOpen || !isMobile)" class="flex-1 flex flex-col bg-gray-50 dark:bg-[#171717] transition-all duration-300">
      <!-- Header -->
      <header class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#171717] shrink-0">
        <div class="flex items-center gap-3">
          <ArrowLeft v-if="isMobile" class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="goBackToList" />
          <img :src="activeFriend.avatar_url || 'https://i.pravatar.cc/100?img=2'" class="w-10 h-10 rounded-full border" />
          <div>
            <h3 class="font-semibold">{{ activeFriend.name }}</h3>
            <p class="text-sm text-gray-500">Đang hoạt động</p>
          </div>
        </div>

        <div class="flex gap-3 text-gray-600 dark:text-gray-400 items-center">
          <Phone class="w-5 h-5 cursor-pointer hover:text-indigo-500" />
          <Video class="w-5 h-5 cursor-pointer hover:text-indigo-500" />
          <MoreVertical class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="showInfoPanel = true" />
        </div>
      </header>

      <!-- Messages -->
      <main ref="chatContainer" class="flex-1 overflow-y-auto p-4 space-y-3" @scroll.passive="handleScroll">
        <div v-if="loadingOlder" class="text-center text-sm text-gray-400 mb-2">Đang tải tin nhắn cũ...</div>

        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words',
            msg.sender_id === useAuthStore().user?.id
              ? 'ml-auto bg-indigo-500 text-white'
              : 'bg-[#FAFAFA] dark:bg-[#171717] border border-gray-200 dark:border-gray-700',
          ]"
        >
          {{ msg.content }}
        </div>
      </main>

      <!-- Input -->
      <footer class="p-4 border-t border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-[#171717] flex items-center gap-2 shrink-0">
        <button class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <Smile class="w-5 h-5" />
        </button>
        <input
          v-model="input"
          type="text"
          placeholder="Nhập tin nhắn..."
          class="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-[#171717] dark:text-white"
          @keyup.enter="sendMessage"
        />
        <button class="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition" @click="sendMessage">
          <Send class="w-5 h-5" />
        </button>
      </footer>
    </section>

    <!-- INFO PANEL -->
    <transition name="slide">
      <aside
        v-if="showInfoPanel"
        class="absolute md:static right-0 top-0 h-full w-full md:w-1/4 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-[#171717] flex flex-col z-20"
      >
        <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <ArrowLeft v-if="isMobile" class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="showInfoPanel = false" />
            <h1 class="font-semibold">Thông tin đoạn chat</h1>
          </div>
          <X v-if="!isMobile" class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="showInfoPanel = false" />
        </div>

        <div class="flex flex-col items-center text-center p-4 space-y-3">
          <img :src="activeFriend?.avatar_url || 'https://i.pravatar.cc/100?img=3'" class="w-20 h-20 rounded-full border" />
          <h3 class="font-semibold text-lg">{{ activeFriend?.name }}</h3>
          <p class="text-sm text-gray-500">Đang hoạt động</p>
        </div>
      </aside>
    </transition>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: rgba(120, 120, 120, 0.3);
  border-radius: 3px;
}
</style>
