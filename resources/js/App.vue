<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue';
import ToastProvider from '@/components/ui/toast/ToastProvider.vue';
import { useLoadingStore } from '@/stores/loadingStore';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useDarkMode } from './composables/useDarkMode';
import { useAuthStore } from './stores/authStore';
import { initEcho } from './echo';

const loadingStore = useLoadingStore();
const isLoading = computed(() => loadingStore.isLoading);
const { t: $t, locale } = useI18n();
const route = useRoute();
const authStore = useAuthStore();

useDarkMode();

watch(
  () => [route.meta.title, locale.value],
  () => {
    const translatedTitle = route.meta.title ? $t(String(route.meta.title)) : 'Worksync';
    document.title = `${translatedTitle} | Worksync App`;
  },
  { immediate: true },
);

if (authStore.token && authStore.user) {
  console.log("Init Echo");
  initEcho(authStore.token);
}

</script>

<template>
  <div>
    <LoadingSpinner :isVisible="isLoading" />
    <RouterView />
    <ToastProvider />
  </div>
</template>
