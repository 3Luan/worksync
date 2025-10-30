<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  direction?: 'left' | 'right';
}>();

const side = computed(() => {
  if (props.direction) return props.direction;
  return Math.random() > 0.5 ? 'left' : 'right';
});
</script>

<template>
  <div class="flex items-start space-x-2 animate-pulse" :class="side === 'right' ? 'flex-row-reverse space-x-reverse' : ''">
    <!-- Avatar -->
    <!-- <div class="w-8 h-8 bg-gray-300 rounded-full"></div> -->

    <!-- Bubble -->
    <div class="flex-1 space-y-2" :class="side === 'right' ? 'items-end text-right' : ''">
      <div class="inline-block px-3 py-2 rounded-2xl" :class="side === 'right' ? 'bg-gray-300 ml-auto rounded-br-none' : 'bg-gray-200 rounded-bl-none'">
        <div class="w-24 h-3 bg-gray-400 rounded mb-1"></div>
        <div class="w-40 h-3 bg-gray-300 rounded mb-1"></div>
        <div class="w-32 h-3 bg-gray-300 rounded"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}
</style>
