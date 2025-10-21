<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { MessageSquare, Mail, User as UserIcon, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { userService } from '@/services/user-service';
import type { User } from '@/types/model';

const users = ref<any>({ data: [] });
const loading = ref(false);
const search = ref('');
const currentPage = ref(1);

const fetchUsers = async (page = 1) => {
  loading.value = true;
  try {
    const res = await userService.getList({ page });
    users.value = res.data;
    currentPage.value = res.data.current_page;
  } finally {
    setTimeout(() => (loading.value = false), 600); // tạo cảm giác mượt hơn
  }
};

onMounted(() => fetchUsers());

const goToPage = (page: number) => {
  if (page !== currentPage.value && page >= 1 && page <= users.value.last_page) {
    fetchUsers(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 text-gray-900 dark:text-gray-100 space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
      <h1 class="text-3xl font-bold flex items-center gap-2"><UserIcon class="w-7 h-7 text-indigo-500" /> Danh sách người dùng</h1>

      <div class="relative w-full sm:w-72">
        <Search class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Tìm kiếm người dùng..."
          class="pl-10 pr-4 py-2 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
    </div>

    <!-- User list -->
    <div v-if="loading" class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <div v-for="n in 8" :key="n" class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow animate-pulse flex flex-col items-center text-center">
        <div class="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mb-4" />
        <div class="h-4 bg-gray-200 dark:bg-gray-700 w-32 rounded mb-2" />
        <div class="h-3 bg-gray-200 dark:bg-gray-700 w-20 rounded mb-1" />
        <div class="h-3 bg-gray-200 dark:bg-gray-700 w-24 rounded" />
        <div class="flex gap-3 mt-4 w-full justify-center">
          <div class="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div class="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    </div>

    <div v-else class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <div
        v-for="user in users.data.filter((user: User) => user.name.toLowerCase().includes(search.toLowerCase()))"
        :key="user.id"
        class="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition flex flex-col items-center text-center"
      >
        <img :src="user.avatar" alt="avatar" class="w-20 h-20 rounded-full mb-3 ring-4 ring-indigo-500/20 object-cover" />
        <h2 class="text-lg font-semibold mb-1">{{ user.name }}</h2>
        <p class="text-sm text-gray-500">@{{ user.username }}</p>
        <p class="text-sm text-gray-400 mt-1 truncate w-full">{{ user.email }}</p>

        <div class="flex gap-3 mt-4">
          <button class="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
            <MessageSquare class="w-4 h-4" /> Nhắn tin
          </button>
          <button
            class="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Mail class="w-4 h-4" /> Liên hệ
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="users.last_page > 1" class="flex justify-center mt-10">
      <nav class="inline-flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl shadow px-3 py-2">
        <button
          :disabled="!users.prev_page_url"
          @click="goToPage(currentPage - 1)"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>

        <button
          v-for="page in users.last_page"
          :key="page"
          @click="goToPage(page)"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
          :class="[page === currentPage ? 'bg-indigo-500 text-white shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200']"
        >
          {{ page }}
        </button>

        <button
          :disabled="!users.next_page_url"
          @click="goToPage(currentPage + 1)"
          class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  h1 {
    font-size: 1.6rem;
  }
}
</style>
