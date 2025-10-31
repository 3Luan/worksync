<script setup lang="ts">
import type { MessageGroupItem } from '@/types/model';
import { useAuthStore } from '@/stores/authStore';
import { computed } from 'vue';

const props = defineProps<{
  messageGroup: MessageGroupItem;
}>();

const auth = useAuthStore();
const isMine = computed(() => props.messageGroup.message.sender_id === auth.user?.id);
</script>

<template>
  <div class="flex" :class="[isMine ? 'justify-end' : 'justify-start', messageGroup.isFirstInGroup ? 'mt-2' : 'mt-[1px]']">
    <div
      :class="[
        'px-3 py-2 max-w-[60%] break-words transition-all',
        isMine ? 'bg-indigo-500 text-white dark:bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white',

        // Border logic
        messageGroup.isFirstInGroup && messageGroup.isLastInGroup
          ? 'rounded-3xl'
          : messageGroup.isFirstInGroup
            ? isMine
              ? 'rounded-3xl rounded-br-md'
              : 'rounded-3xl rounded-bl-md'
            : messageGroup.isLastInGroup
              ? isMine
                ? 'rounded-3xl rounded-tr-md'
                : 'rounded-3xl rounded-tl-md'
              : isMine
                ? 'rounded-md rounded-l-3xl'
                : 'rounded-md rounded-r-3xl',

        isMine ? 'ml-auto' : 'mr-auto',
      ]"
    >
      {{ messageGroup.message.content }}
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
