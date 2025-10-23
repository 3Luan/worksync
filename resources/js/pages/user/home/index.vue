<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { userService } from '@/services/user-service';
import { User as UserIcon, Search, MessageSquare, Users } from 'lucide-vue-next';
import type { User } from '@/types/model';
import { AVATAR_DEFAULT } from '@/constants/imageConst';

const users = ref<User[]>([]);
const loading = ref(false);
const search = ref('');
const page = ref(1);
const lastPage = ref(1);
const observer = ref<IntersectionObserver | null>(null);
const loadMoreTrigger = ref<HTMLDivElement | null>(null);

const fetchUsers = async (append = false) => {
  if (loading.value) return;
  loading.value = true;
  try {
    const res = await userService.getList({ page: page.value });
    const data = res.data;
    lastPage.value = data.last_page;
    users.value = append ? [...users.value, ...data.data] : data.data;
  } finally {
    loading.value = false;
  }
};

const filteredUsers = computed(() => {
  const keyword = search.value.toLowerCase();
  return users.value.filter(
    (u: User) => u.name.toLowerCase().includes(keyword) || u.username.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword),
  );
});

// Infinite scroll
const setupObserver = () => {
  observer.value = new IntersectionObserver(
    async (entries) => {
      if (entries[0].isIntersecting && page.value < lastPage.value && !loading.value) {
        page.value++;
        await fetchUsers(true);
      }
    },
    { rootMargin: '200px' },
  );

  if (loadMoreTrigger.value) observer.value.observe(loadMoreTrigger.value);
};

onMounted(async () => {
  await fetchUsers();
  nextTick(() => setupObserver());
});

onUnmounted(() => observer.value?.disconnect());
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="max-w-7xl mx-auto p-6 space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-5">
        <div class="flex items-center gap-3">
          <UserIcon class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Khám phá bạn bè</h1>
        </div>

        <div class="relative w-full sm:w-80">
          <Search class="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            v-model="search"
            placeholder="Tìm kiếm bạn bè..."
            class="pl-10 pr-4 py-2.5 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          />
        </div>
      </div>

      <!-- User Grid -->
      <div class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <!-- Skeleton Loading -->
        <template v-if="loading && users.length === 0">
          <div v-for="n in 8" :key="n" class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow animate-pulse text-center">
            <div class="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded mb-3"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto mb-2"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mt-3"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mt-2"></div>
          </div>
        </template>

        <!-- User Cards -->
        <div
          v-for="user in filteredUsers"
          :key="user.id"
          class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm flex flex-col items-center text-center"
        >
          <img
            :src="user?.avatar || AVATAR_DEFAULT"
            alt="avatar"
            class="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <h2 class="font-semibold text-gray-800 dark:text-gray-100 mt-2">{{ user.name }}</h2>

          <div class="p-3 mt-2 space-y-2 w-full">
            <button
              class="w-full py-2 text-sm font-medium bg-blue-100 hover:bg-blue-200 text-white rounded-md flex items-center justify-center gap-1 transition"
            >
              <MessageSquare class="w-4 h-4 text-blue-700" />
              <span class="text-blue-700"> Nhắn tin </span>
            </button>
            <button
              class="w-full py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md flex items-center justify-center gap-1 transition hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <Users class="w-4 h-4" /> Tạo nhóm
            </button>
          </div>
        </div>
      </div>

      <!-- Infinite Scroll Trigger -->
      <div ref="loadMoreTrigger" class="h-10"></div>

      <!-- Loading more shimmer -->
      <div v-if="loading && users.length > 0" class="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div v-for="n in 4" :key="'skeleton-' + n" class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow animate-pulse text-center">
          <div class="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded mb-3"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto mb-2"></div>
          <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mt-3"></div>
          <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mt-2"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
.animate-pulse {
  animation: pulse 1.2s ease-in-out infinite;
}
</style>
