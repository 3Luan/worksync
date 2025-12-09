import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useAuthStore } from './authStore';
import { getEcho } from '@/echo';

export const useChannelStore = defineStore('channel', () => {
  const authStore = useAuthStore();
  const echo = getEcho();

  // Stores all active channels (key = channel name)
  const channels = ref<Record<string, any>>({});

  // Stores the authenticated user's personal channel
  const userChannel = ref<any>(null);

  // Join a private channel by name
  const join = (name: string) => {
    if (!echo) return null;

    // Reuse existing channel
    if (channels.value[name]) {
      return channels.value[name];
    }

    // Create a new private channel
    const channel = echo.private(name);
    channels.value[name] = channel;

    return channel;
  };

  // Leave a channel by name
  const leave = (name: string) => {
    if (!echo) return;

    if (channels.value[name]) {
      echo.leave(name);
      delete channels.value[name];
    }
  };

  // User channel
  const initUserChannel = () => {
    if (!authStore.user) return;

    const name = `user.${authStore.user.id}`;
    userChannel.value = join(name);
  };

  // Leave the user's personal channel
  const clearUserChannel = () => {
    if (!authStore.user) return;

    const name = `user.${authStore.user.id}`;
    leave(name);
    userChannel.value = null;
  };

  // Leave all channels
  const clearAll = () => {
    Object.keys(channels.value).forEach((name) => leave(name));

    channels.value = {};
    userChannel.value = null;
  };

  // Watch auth state
  watch(
    () => authStore.user,
    (user) => {
      if (user) initUserChannel();
      else clearAll();
    },
    { immediate: true }
  );

  return {
    channels,

    // Generic actions
    join,
    leave,
    clearAll,

    // User channel
    userChannel,
    initUserChannel,
    clearUserChannel,
  };
});
