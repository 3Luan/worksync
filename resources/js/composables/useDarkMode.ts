import { ref, onMounted } from 'vue';
import { LOCAL_STORAGE_COLOR_THEME } from '@/constants';
import { ColorTheme } from '@/enums';

const isDark = ref(false);

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    applyDarkClass();
  };

  const applyDarkClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add(ColorTheme.Dark);
      localStorage.setItem(LOCAL_STORAGE_COLOR_THEME, ColorTheme.Dark);
    } else {
      document.documentElement.classList.remove(ColorTheme.Dark);
      localStorage.setItem(LOCAL_STORAGE_COLOR_THEME, ColorTheme.Light);
    }
  };

  const initDarkMode = () => {
    const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const localTheme = localStorage.getItem(LOCAL_STORAGE_COLOR_THEME);

    isDark.value = localTheme === ColorTheme.Dark || (!localTheme && userPrefersDark);
    applyDarkClass();
  };

  onMounted(() => {
    initDarkMode();
  });

  return {
    isDark,
    toggleDarkMode,
  };
}
