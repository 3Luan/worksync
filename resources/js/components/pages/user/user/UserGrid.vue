<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { userService } from '@/services/user-service';
import type { User } from '@/types/model';
import UserCard from './UserCard.vue';
import UserSkeleton from './UserSkeleton.vue';

const props = defineProps<{ search: string }>();

const users = ref<User[]>([]);
const loading = ref(false);
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
  const keyword = props.search.toLowerCase();
  return users.value.filter(
    (u) => u.name.toLowerCase().includes(keyword) || u.username.toLowerCase().includes(keyword) || u.email.toLowerCase().includes(keyword),
  );
});

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
  <div class="grid gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
    <template v-if="loading && users.length === 0">
      <UserSkeleton v-for="n in 8" :key="n" />
    </template>

    <UserCard v-for="user in filteredUsers" :key="user.id" :user="user" />

    <div ref="loadMoreTrigger" class="h-10"></div>

    <template v-if="loading && users.length > 0">
      <UserSkeleton v-for="n in 4" :key="'skeleton-' + n" />
    </template>
  </div>
</template>
