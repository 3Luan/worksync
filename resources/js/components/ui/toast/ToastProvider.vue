<script setup lang="ts">
import { X, AlertCircle, Info, Check } from 'lucide-vue-next';
import { useToast } from './index';

const { toasts, dismiss } = useToast();
</script>

<template>
  <div class="fixed top-4 right-4 z-100 flex flex-col gap-2 m-4 md:max-w-[420px]">
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all transform hover:scale-[1.01] hover:shadow-xl"
        :class="{
          'bg-white border border-gray-200 text-gray-800': toast.variant === 'default',
          'bg-red-50 border border-red-200 text-red-800': toast.variant === 'destructive',
          'bg-green-50 border border-green-200 text-green-800': toast.variant === 'success',
        }"
      >
        <div class="flex items-center gap-3">
          <div
            v-if="toast.variant === 'destructive'"
            class="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 shrink-0"
          >
            <AlertCircle class="h-5 w-5" />
          </div>
          <div
            v-if="toast.variant === 'success'"
            class="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 shrink-0"
          >
            <Check class="h-5 w-5" />
          </div>
          <div
            v-if="toast.variant === 'default'"
            class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 shrink-0"
          >
            <Info class="h-5 w-5" />
          </div>
          <div class="grid gap-1">
            <div class="text-sm font-semibold">{{ toast.title }}</div>
            <div class="text-sm text-gray-500">
              {{ toast.description }}
            </div>
          </div>
        </div>
        <button
          @click="dismiss(toast.id)"
          class="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none"
          :class="{
            'text-gray-500 hover:text-gray-700': toast.variant === 'default',
            'text-red-500 hover:text-red-700': toast.variant === 'destructive',
            'text-green-500 hover:text-green-700': toast.variant === 'success',
          }"
        >
          <span class="sr-only">Close</span>
          <X class="h-4 w-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Optional: Add transition for toast hover effect */
.group {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
</style>
