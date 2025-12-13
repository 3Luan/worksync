<script setup lang="ts">
import { ref, watch } from 'vue';
import { Search } from 'lucide-vue-next';

const input = ref('');

const handleSearch = (query: string) => {
  console.log('search: ', query);
};

watch(input, (val) => {
  handleSearch(val);
});
</script>

<template>
  <div
    class="h-16 p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-[#171717]"
  >
    <div class="relative w-full">
      <Search class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      <input
        v-model="input"
        type="text"
        placeholder="Tìm kiếm đoạn chat..."
        class="pl-10 pr-4 py-2 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
      />
    </div>
  </div>
</template>
