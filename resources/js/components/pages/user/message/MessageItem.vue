<script setup lang="ts">
import type { Message } from '@/types/model';
import { useAuthStore } from '@/stores/authStore';
import { computed } from 'vue';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const props = defineProps<{
  message: Message;
}>();

const auth = useAuthStore();
const isMine = computed(() => props.message.sender_id === auth.user?.id);

const time = computed(() => {
  if (!props.message.created_at) return '';
  try {
    return format(new Date(props.message.created_at), 'HH:mm', { locale: vi });
  } catch {
    return '';
  }
});
</script>

<template>
  <div class="flex w-full" :class="isMine ? 'justify-end' : 'justify-start'">
    <div
      :class="[
        'relative px-4 py-2 rounded-2xl text-sm shadow-sm',
        'min-w-[60px] max-w-[80%] break-all leading-relaxed overflow-hidden whitespace-pre-wrap',
        isMine
          ? 'bg-indigo-500 text-white rounded-br-sm'
          : 'bg-gray-100 dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-bl-sm border border-gray-200 dark:border-gray-700',
      ]"
      role="message"
    >
      <p class="whitespace-pre-line">{{ message.content }}</p>

      <span v-if="time" class="absolute bottom-0 right-2 text-[10px] text-gray-300 dark:text-gray-500 translate-y-full mt-0.5">
        {{ time }}
      </span>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

[role='message'] {
  animation: fadeUp 0.2s ease-out;
}
</style>
