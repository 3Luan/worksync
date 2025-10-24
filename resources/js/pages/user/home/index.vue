<script setup lang="ts">
import { ref } from 'vue';
import { User as UserIcon, Search } from 'lucide-vue-next';
import UserGrid from '@/components/pages/user/user/UserGrid.vue';

const search = ref('');
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div class="max-w-7xl mx-auto p-6 space-y-8">
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

      <UserGrid :search="search" />
    </div>
  </div>
</template>
