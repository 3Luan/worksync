import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
  const isMobileView = window.innerWidth <= 768;

  return {
    isMobileView,
  };
});
