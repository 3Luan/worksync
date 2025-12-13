<script setup lang="ts">
import { MessageSquare, Users } from 'lucide-vue-next';
import { AVATAR_DEFAULT } from '@/constants/imageConst';
import type { User } from '@/types/model';
import { useRouter } from 'vue-router';

const props = defineProps<{ user: User }>();

const router = useRouter();

const sendMessage = () => {
  router.push(`/messages/${props.user.id}`);
};
</script>

<template>
  <div
    class="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm flex flex-col items-center text-center group"
  >
    <img
      :src="user.avatar || AVATAR_DEFAULT"
      alt="avatar"
      class="w-full aspect-square object-cover transition-transform duration-300 rounded-t-lg"
    />
    <h2
      class="w-full px-3 font-semibold text-gray-800 dark:text-gray-100 mt-2 truncate overflow-hidden whitespace-nowrap"
    >
      {{ user.name }}
    </h2>
    <div class="p-3 mt-2 space-y-2 w-full">
      <button
        @click="sendMessage"
        class="w-full py-2 text-sm font-medium bg-blue-100 hover:bg-blue-200 text-white rounded-md flex items-center justify-center gap-1 transition"
      >
        <MessageSquare class="w-4 h-4 text-blue-700" />
        <span class="text-blue-700">Nhắn tin</span>
      </button>

      <button
        class="w-full py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-md flex items-center justify-center gap-1 transition hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <Users class="w-4 h-4" /> Tạo nhóm
      </button>
    </div>
  </div>
</template>
