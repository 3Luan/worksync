<script setup lang="ts">
import { Moon, Sun, Home, MessageSquare } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { APP_ROUTE_NAME } from '@/constants/url';
import { useDarkMode } from '@/composables/useDarkMode';
import ProfilePopup from '@/components/common/ProfilePopup.vue';
import { LOGO_WORKSYNC } from '@/constants/imageConst';

const { t: $t } = useI18n();
const { isDark, toggleDarkMode } = useDarkMode();

const headerMenu = [
  { title: 'common.home', routeName: APP_ROUTE_NAME.USER.INDEX, icon: Home },
  { title: 'common.messages', routeName: APP_ROUTE_NAME.USER.MESSAGES, icon: MessageSquare },
];
</script>

<template>
  <div class="h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#171717] transition-colors">
    <!-- HEADER -->
    <header class="bg-white dark:bg-[#171717] h-14 shadow flex items-center justify-between px-4 border-b border-gray-300 dark:border-gray-700">
      <!-- LEFT: Logo -->
      <div class="flex items-center gap-3">
        <img :src="LOGO_WORKSYNC" class="w-13 h-10 object-cover" />
        <div class="font-bold text-xl cursor-pointer hidden sm:inline">Worksync</div>
      </div>

      <!-- CENTER: Navigation -->
      <nav class="flex items-center gap-6">
        <RouterLink v-for="item in headerMenu" :key="item.routeName" :to="{ name: item.routeName }" v-slot="{ href }">
          <div
            :class="[
              'flex items-center gap-1 px-3 py-2 rounded-md transition cursor-pointer',
              $route.matched.some((m) => m.name === item.routeName)
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800',
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="hidden sm:inline">{{ $t(item.title) }}</span>
          </div>
        </RouterLink>
      </nav>

      <!-- RIGHT: Actions -->
      <div class="flex items-center gap-2">
        <button class="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer" @click="toggleDarkMode">
          <Sun v-if="isDark" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>

        <ProfilePopup />
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>
