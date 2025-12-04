import { getEcho } from '@/echo';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useAuthStore } from './authStore';

export const useChannelStore = defineStore('channel', () => {
  const authStore = useAuthStore();
  const userChannel = ref<any>(null);

  const initUserChannel = () => {
    const echo = getEcho();
    if (!echo || !authStore.user) return;

    // unsubscribe nếu trước đó có channel
    if (userChannel.value) {
      userChannel.value.unsubscribe();
    }

    userChannel.value = echo.private(`user.${authStore.user.id}`);
  };

  const clearUserChannel = () => {
    if (userChannel.value) {
      userChannel.value.unsubscribe();
      userChannel.value = null;
    }
  };

  // Tự động init khi user login
  watch(
    () => authStore.user,
    (newUser) => {
      if (newUser) initUserChannel();
      else clearUserChannel();
    },
    { immediate: true }
  );

  return {
    userChannel,
    initUserChannel,
    clearUserChannel,
  };
});
