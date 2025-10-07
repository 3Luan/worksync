<script setup lang="ts">
import { computed, watch } from 'vue';
import ToastProvider from '@/components/ui/toast/ToastProvider.vue';
import { useLoadingStore } from '@/stores/loadingStore';
import LoadingSpinner from '@/components/ui/loading/LoadingSpinner.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useDarkMode } from './composables/useDarkMode';

const loadingStore = useLoadingStore();
const isLoading = computed(() => loadingStore.isLoading);
const { t: $t, locale } = useI18n();
const route = useRoute();

useDarkMode();

watch(
  () => [route.meta.title, locale.value],
  () => {
    const translatedTitle = route.meta.title ? $t(String(route.meta.title)) : 'Worksync';
    document.title = `${translatedTitle} | Worksync App`;
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <LoadingSpinner :isVisible="isLoading" />
    <RouterView />
    <ToastProvider />
  </div>
</template>
