import { useLoadingStore } from '@/stores/loadingStore';

export function useLoading() {
  const loadingStore = useLoadingStore();

  const showLoading = () => {
    loadingStore.showLoading();
  };

  const hideLoading = () => {
    loadingStore.hideLoading();
  };

  return {
    showLoading,
    hideLoading,
    isLoading: loadingStore.isLoading,
  };
}
