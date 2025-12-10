<script setup lang="ts">
import type { MessageGroupItem } from '@/types/model';
import { useAuthStore } from '@/stores/authStore';
import { useChatStore } from '@/stores/chatStore';
import { computed } from 'vue';
import { MESSAGE_STATUS } from '@/constants';
import { AVATAR_DEFAULT } from '@/constants/imageConst';

const props = defineProps<{
  messageGroup: MessageGroupItem;
}>();

const chatStore = useChatStore();
const auth = useAuthStore();
const isMine = computed(() => props.messageGroup.message.sender_id === auth.user?.id);

// Tin nhắn cuối cùng của mình
const latestMyMessageId = computed(() => {
  const myMsgs = chatStore.messages.filter((m) => m.sender_id === auth.user?.id);
  return myMsgs.length ? myMsgs[myMsgs.length - 1].id : null;
});

const lastSeenMessageId = computed(() => {
  const myMsgs = chatStore.messages.filter((m) => m.sender_id === auth.user?.id);
  const seenMsgs = myMsgs.filter((m) => m.status === MESSAGE_STATUS.SEEN);
  return seenMsgs.length ? seenMsgs[seenMsgs.length - 1].id : null;
});

// Text trạng thái (chỉ dùng cho status khác "Đã xem")
const statusText = computed(() => {
  const status = props.messageGroup.message.status;
  if (status === MESSAGE_STATUS.SEEN) return ''; // ẩn text khi đã xem (sẽ có icon riêng)
  switch (status) {
    case MESSAGE_STATUS.SENDING:
      return 'Đang gửi...';
    case MESSAGE_STATUS.SENT:
      return 'Đã gửi';
    case MESSAGE_STATUS.DELIVERED:
      return 'Đã nhận';
    case MESSAGE_STATUS.FAILED:
      return 'Gửi thất bại';
    default:
      return '';
  }
});
</script>

<template>
  <div class="flex" :class="[isMine ? 'justify-end' : 'justify-start', messageGroup.isFirstInGroup ? 'mt-2' : 'mt-[1px]']">
    <div
      :class="[
        'px-3 py-2 max-w-[60%] break-words transition-all relative',
        isMine ? 'bg-indigo-500 text-white dark:bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white',
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

  <!-- 👁️ Icon “Đã xem” nằm ngoài -->
  <div v-if="isMine && messageGroup.message.id === lastSeenMessageId" class="flex justify-end mt-1">
    <img :src="AVATAR_DEFAULT" alt="seen" class="w-4 h-4 rounded-full border border-white dark:border-gray-800" />
  </div>

  <!-- ⚡️ Hiển thị status text bình thường ở tin nhắn cuối cùng của mình -->
  <div v-if="isMine && statusText && messageGroup.message.id === latestMyMessageId" class="text-xs mt-1 mr-2 text-gray-400 dark:text-gray-500 text-right">
    {{ statusText }}
  </div>
</template>
