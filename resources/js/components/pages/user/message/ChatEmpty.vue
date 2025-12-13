<script setup lang="ts"></script>
<template>
  <div
    class="flex flex-1 flex-col items-center justify-center text-center p-8 text-gray-500 dark:text-gray-400 select-none relative overflow-hidden"
  >
    <!-- Illustration -->
    <div class="relative flex flex-col items-center space-y-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-28 h-28 text-indigo-400 dark:text-indigo-500 drop-shadow-md"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.3"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.73 9.73 0 01-4.28-.95L3 20l1.19-3.58A7.49 7.49 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>

      <!-- Text -->
      <div class="relative">
        <h2 class="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
          Chọn một cuộc trò chuyện để bắt đầu
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
          Hãy chọn một người bạn để bắt đầu cuộc trò chuyện.
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-12px) scale(1.05);
  }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
.animate-float-delayed {
  animation: float 8s ease-in-out infinite 2s;
}
div {
  animation: fadeIn 0.4s ease;
}
</style>
