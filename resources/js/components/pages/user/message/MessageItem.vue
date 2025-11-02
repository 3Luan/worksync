<script setup lang="ts">
import type { MessageGroupItem } from '@/types/model';
import { useAuthStore } from '@/stores/authStore';
import { computed } from 'vue';
import { MESSAGE_STATUS } from '@/constants';

const props = defineProps<{
  messageGroup: MessageGroupItem;
}>();

const auth = useAuthStore();
const isMine = computed(() => props.messageGroup.message.sender_id === auth.user?.id);

const statusText = computed(() => {
  const status = props.messageGroup.message.status;

  switch (status) {
    case MESSAGE_STATUS.SENDING:
      return 'Đang gửi...';
    case MESSAGE_STATUS.SENT:
      return 'Đã gửi';
    case MESSAGE_STATUS.DELIVERED:
      return 'Đã nhận';
    case MESSAGE_STATUS.SEEN:
      return 'Đã xem';
    case MESSAGE_STATUS.FAILED:
      return 'Gửi thất bại';
    default:
      return '';
  }
});
</script>

<template>
  <div
    class="flex"
    :class="[
      isMine ? 'justify-end' : 'justify-start',
      messageGroup.isFirstInGroup ? 'mt-2' : 'mt-[1px]',
    ]"
  >
    <div
      :class="[
        'px-3 py-2 max-w-[60%] break-words transition-all',
        isMine
          ? 'bg-indigo-500 text-white dark:bg-indigo-600'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white',

        // Bo góc
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

  <!-- ⚡️ Thêm dòng trạng thái -->
  <div
    v-if="isMine && statusText && messageGroup.isLastInGroup"
    class="text-xs mt-1 mr-2 text-gray-400 dark:text-gray-500 text-right"
  >
    {{ statusText }}
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
