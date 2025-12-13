import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useGlobalStore = defineStore('global', () => {
  /* =======================
   * Loading (global)
   * ======================= */
  const loadingCount = ref(0);

  const isLoading = computed(() => loadingCount.value > 0);

  const startLoading = () => {
    loadingCount.value++;
  };

  const stopLoading = () => {
    if (loadingCount.value > 0) {
      loadingCount.value--;
    }
  };

  /* =======================
   * Mobile view (reactive)
   * ======================= */
  const isMobileView = ref(window.innerWidth <= 768);

  const updateViewport = () => {
    isMobileView.value = window.innerWidth <= 768;
  };

  window.addEventListener('resize', updateViewport);

  return {
    /* loading */
    isLoading,
    startLoading,
    stopLoading,

    /* viewport */
    isMobileView,
  };
});
