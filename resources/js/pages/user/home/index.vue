<script setup lang="ts">
import { ref } from 'vue';
import { MessageSquare, Users, Bell, Settings, ArrowRight } from 'lucide-vue-next';

const user = ref({
  name: 'Nguyễn Thanh Luân',
  avatar: 'https://i.pravatar.cc/150?img=64',
  email: 'luan@example.com',
  status: 'Đang hoạt động',
});

const recentChats = ref([
  { id: 1, name: 'Nguyễn Minh', lastMessage: 'Hôm nay đi cafe nhé ☕', time: '2 phút trước', avatar: 'https://i.pravatar.cc/50?img=12' },
  { id: 2, name: 'Trần Hà', lastMessage: 'Ok, để mình gửi file đó!', time: '15 phút trước', avatar: 'https://i.pravatar.cc/50?img=20' },
  { id: 3, name: 'Lê Quân', lastMessage: 'Cảm ơn nhé 🙏', time: '1 giờ trước', avatar: 'https://i.pravatar.cc/50?img=33' },
]);

const activities = ref([
  { id: 1, text: 'Bạn đã gửi tin nhắn cho Trần Hà', time: '15 phút trước' },
  { id: 2, text: 'Bạn thêm nhóm “Team Dev Worksync”', time: '3 giờ trước' },
  { id: 3, text: 'Đã cập nhật ảnh đại diện', time: 'Hôm qua' },
]);
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-8 text-gray-900 dark:text-gray-100">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-4">
        <img :src="user.avatar" class="w-20 h-20 rounded-full ring-4 ring-indigo-500" />
        <div>
          <h1 class="text-2xl font-bold">{{ user.name }}</h1>
          <p class="text-gray-500 dark:text-gray-400">{{ user.email }}</p>
          <p class="text-green-500 text-sm">{{ user.status }}</p>
        </div>
      </div>
      <button class="flex items-center gap-2 bg-indigo-500 text-white px-5 py-2 rounded-xl hover:bg-indigo-600 transition">
        <MessageSquare class="w-4 h-4" />
        Bắt đầu trò chuyện
      </button>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center gap-4">
        <MessageSquare class="w-8 h-8 text-indigo-500" />
        <div>
          <p class="text-sm text-gray-500">Tin nhắn</p>
          <h3 class="text-lg font-semibold">128 cuộc hội thoại</h3>
        </div>
      </div>
      <div class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center gap-4">
        <Users class="w-8 h-8 text-indigo-500" />
        <div>
          <p class="text-sm text-gray-500">Bạn bè</p>
          <h3 class="text-lg font-semibold">52 người</h3>
        </div>
      </div>
      <div class="p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center gap-4">
        <Bell class="w-8 h-8 text-indigo-500" />
        <div>
          <p class="text-sm text-gray-500">Thông báo</p>
          <h3 class="text-lg font-semibold">5 chưa đọc</h3>
        </div>
      </div>
    </div>

    <!-- Recent chats -->
    <section>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">💬 Cuộc trò chuyện gần đây</h2>
        <router-link to="/user/messages" class="text-indigo-500 hover:text-indigo-600 flex items-center gap-1 text-sm">
          Xem tất cả <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md divide-y divide-gray-100 dark:divide-gray-700">
        <div
          v-for="chat in recentChats"
          :key="chat.id"
          class="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <img :src="chat.avatar" class="w-10 h-10 rounded-full" />
            <div>
              <p class="font-medium">{{ chat.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ chat.lastMessage }}</p>
            </div>
          </div>
          <span class="text-sm text-gray-400">{{ chat.time }}</span>
        </div>
      </div>
    </section>

    <!-- Activity timeline -->
    <section>
      <h2 class="text-xl font-semibold mb-4">🕓 Hoạt động gần đây</h2>
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 space-y-3">
        <div v-for="act in activities" :key="act.id" class="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0">
          <p>{{ act.text }}</p>
          <span class="text-sm text-gray-400">{{ act.time }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  h1 {
    font-size: 1.4rem;
  }
}
</style>
