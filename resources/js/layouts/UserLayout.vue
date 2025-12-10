<script setup lang="ts">
import { Moon, Sun, Home, MessageSquare } from 'lucide-vue-next';
import { APP_ROUTE_NAME } from '@/constants/url';
import { useDarkMode } from '@/composables/useDarkMode';
import ProfilePopup from '@/components/common/ProfilePopup.vue';
import { LOGO_WORKSYNC } from '@/constants/imageConst';

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
      <router-link :to="{ name: APP_ROUTE_NAME.USER.INDEX }" class="flex items-center gap-3">
        <img :src="LOGO_WORKSYNC" class="w-13 h-10 object-cover" />
        <div class="font-bold text-xl cursor-pointer hidden sm:inline">Worksync</div>
      </router-link>

      <!-- CENTER: Navigation -->
      <nav class="flex items-center gap-6">
      <RouterLink
          v-for="item in headerMenu"
          :key="item.routeName"
          :to="{ name: item.routeName }"
        >
          <div
            :class="[
              'flex items-center gap-2 px-5 sm:px-7 md:px-10 py-2 rounded-md transition-all duration-200 cursor-pointer relative',
              $route.matched.some((m) => m.name === item.routeName)
                ? 'text-blue-600 dark:text-blue-300 font-semibold'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800',
            ]"
          >
          <span
              v-if="$route.matched.some((m) => m.name === item.routeName)"
              class="absolute -bottom-2 left-0 w-full h-[4px] bg-blue-500 rounded-t-md"
            ></span>
            <component :is="item.icon" class="w-6 h-6" />
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
