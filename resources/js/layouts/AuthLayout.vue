<script setup lang="ts">
</script>

<template>
  <div
    class="h-[100dvh] bg-background bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300 overflow-y-auto overflow-x-hidden"
  >
    <div class="flex-grow flex flex-col items-center justify-center p-4">
      <div class="w-full text-center">
        <div class="inline-flex items-center gap-2 text-primary mb-4">
          <span class="text-4xl font-bold">Worksync</span>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>
