<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Send, Smile, Phone, Video, MoreVertical, X, ArrowLeft } from 'lucide-vue-next';

const friends = ref([
  { id: 1, name: 'Nguyễn Minh', avatar: 'https://i.pravatar.cc/100?img=1', online: true },
  { id: 2, name: 'Trần Hà', avatar: 'https://i.pravatar.cc/100?img=2', online: false },
  { id: 3, name: 'Lê Quân', avatar: 'https://i.pravatar.cc/100?img=3', online: true },
  { id: 4, name: 'Phạm Anh', avatar: 'https://i.pravatar.cc/100?img=4', online: false },
]);

const messages = ref([
  { id: 1, from: 'friend', text: 'Chào bạn 👋' },
  { id: 2, from: 'me', text: 'Hello! Dạo này sao rồi?' },
]);

const activeFriend = ref<any>(null);
const input = ref('');
const showInfoPanel = ref(false);
const isChatOpen = ref(false); // ✅ theo dõi trạng thái chat trên mobile

const sendMessage = () => {
  if (!input.value.trim()) return;
  messages.value.push({ id: Date.now(), from: 'me', text: input.value });
  input.value = '';
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      from: 'friend',
      text: 'Mình ổn lắm, cảm ơn nha 😄',
    });
  }, 1000);
};

const selectFriend = (friend: any) => {
  activeFriend.value = friend;
  messages.value = [
    { id: 1, from: 'friend', text: `Xin chào, mình là ${friend.name}!` },
    { id: 2, from: 'me', text: 'Rất vui được gặp bạn 😁' },
  ];
  showInfoPanel.value = false;
  if (window.innerWidth < 768) isChatOpen.value = true; // ✅ mobile: mở chat
};

const goBackToList = () => {
  isChatOpen.value = false;
  activeFriend.value = null;
};

const isMobile = computed(() => window.innerWidth < 768);
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    isChatOpen.value = true; // desktop: luôn hiển thị chat
  } else {
    isChatOpen.value = false; // mobile: quay lại list
  }
});
</script>

<template>
  <div class="flex h-[calc(100vh-56px)] bg-[#FAFAFA] dark:bg-gray-900 rounded-lg overflow-hidden relative">
    <!-- SIDEBAR (Danh sách bạn bè) -->
    <aside v-if="!isChatOpen || !isMobile" class="w-full md:w-1/4 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-gray-800">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="font-bold text-lg">Tin nhắn</h2>
        <Search class="w-5 h-5 text-gray-500" />
      </div>

      <div class="flex-1 overflow-y-auto">
        <div
          v-for="friend in friends"
          :key="friend.id"
          class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          :class="{ 'bg-indigo-100 dark:bg-gray-700': activeFriend?.id === friend.id }"
          @click="selectFriend(friend)"
        >
          <div class="relative">
            <img :src="friend.avatar" class="w-10 h-10 rounded-full" />
            <span v-if="friend.online" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
          </div>
          <div class="flex-1">
            <p class="font-medium">{{ friend.name }}</p>
            <p class="text-sm text-gray-500">Nhắn tin ngay...</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- CHAT MAIN -->
    <section v-if="activeFriend && (isChatOpen || !isMobile)" class="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <!-- Header -->
      <header
        v-if="activeFriend"
        class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-gray-800 shrink-0"
      >
        <div class="flex items-center gap-3">
          <!-- ✅ Nút quay lại chỉ hiện ở mobile -->
          <ArrowLeft v-if="isMobile" class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="goBackToList" />
          <img :src="activeFriend.avatar" class="w-10 h-10 rounded-full border" />
          <div>
            <h3 class="font-semibold">{{ activeFriend.name }}</h3>
            <p class="text-sm text-green-500" v-if="activeFriend.online">Đang hoạt động</p>
            <p class="text-sm text-gray-500" v-else>Offline</p>
          </div>
        </div>

        <div class="flex gap-3 text-gray-600 dark:text-gray-400 items-center">
          <Phone class="w-5 h-5 cursor-pointer hover:text-indigo-500" />
          <Video class="w-5 h-5 cursor-pointer hover:text-indigo-500" />
          <MoreVertical class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="showInfoPanel = true" />
        </div>
      </header>

      <!-- Messages -->
      <main class="flex-1 overflow-y-auto p-4 space-y-3">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'max-w-[70%] px-4 py-2 rounded-2xl text-sm',
            msg.from === 'me' ? 'ml-auto bg-indigo-500 text-white' : 'bg-[#FAFAFA] dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          ]"
        >
          {{ msg.text }}
        </div>
      </main>

      <!-- Input -->
      <footer class="p-4 border-t border-gray-200 dark:border-gray-700 bg-[#FAFAFA] dark:bg-gray-800 flex items-center gap-2 shrink-0">
        <button class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <Smile class="w-5 h-5" />
        </button>
        <input
          v-model="input"
          type="text"
          placeholder="Nhập tin nhắn..."
          class="flex-1 p-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-900"
          @keyup.enter="sendMessage"
        />
        <button class="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition" @click="sendMessage">
          <Send class="w-5 h-5" />
        </button>
      </footer>
    </section>

    <!-- PANEL bên phải -->
    <transition name="slide">
      <aside
        v-if="showInfoPanel"
        class="absolute md:static right-0 top-0 h-full w-full md:w-1/4 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col z-20"
      >
        <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <ArrowLeft v-if="isMobile" class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="showInfoPanel = false" />
            <h2 class="font-semibold">Thông tin đoạn chat</h2>
          </div>
          <X v-if="!isMobile" class="w-5 h-5 cursor-pointer hover:text-indigo-500" @click="showInfoPanel = false" />
        </div>

        <div class="flex flex-col items-center text-center p-4 space-y-3">
          <img :src="activeFriend.avatar" class="w-20 h-20 rounded-full border" />
          <h3 class="font-semibold text-lg">{{ activeFriend.name }}</h3>
          <p class="text-sm text-gray-500">{{ activeFriend.online ? 'Đang hoạt động' : 'Offline' }}</p>
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
