<template>
  <div class="bg-white dark:bg-gray-900 p-4 rounded-lg shadow animate-pulse text-center">
    <div class="w-full aspect-square bg-gray-200 dark:bg-gray-800 rounded mb-3"></div>
    <div class="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto mb-2"></div>
    <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mt-3"></div>
    <div class="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mt-2"></div>
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
