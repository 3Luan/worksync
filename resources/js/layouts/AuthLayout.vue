<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md transition-all">
      <router-view />

      <p class="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
        © 2025 WorkSync
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
