<template>
  <SidebarProvider>
    <!-- Temporarily Dashboard and Timesheet pageshidden -->
    <AppSidebar :data="sidebarDataWithCounts" />
    <SidebarInset class="h-[calc(100vh-0.1rem)] w-[calc(100%-48px)] transition-colors duration-300 overflow-y-auto">
      <header class="flex h-12 shrink-0 items-center gap-2 px-4 shadow-2xl justify-between transition-colors duration-300">
        <div class="w-fit flex items-center">
          <SidebarTrigger class="mr-2 cursor-pointer" />
          <Breadcrumb class="">
            <BreadcrumbList>
              <BreadcrumbItem v-for="(item, index) in breadcrumb" :key="item.path">
                <BreadcrumbLink v-if="index < breadcrumb.length - 1" class="text-nowrap text-[13px] sm:text-[16px]">
                  <router-link :to="item.path">
                    {{ $t(`${item.name}`) }}
                  </router-link>
                </BreadcrumbLink>
                <BreadcrumbPage v-else class="text-nowrap transition-colors duration-300 text-[13px] sm:text-[16px]">
                  {{ $t(`${item.name}`) }}
                </BreadcrumbPage>
                <BreadcrumbSeparator v-if="index < breadcrumb.length - 1" />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div class="flex flex-row">
          <button class="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer mr-1" @click="toggleDarkMode">
            <Sun v-if="isDark" class="h-5 w-5" />
            <Moon v-else class="h-5 w-5" />
          </button>
          <!-- User Profile Dropdown -->
          <UserProfile />
        </div>
      </header>
      <div class="bg-[#e9e9e9] dark:bg-black w-full h-full p-2 sm:p-6 overflow-auto transition-colors duration-300">
        <RouterView />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/ui/sidebar/AppSidebar.vue';
import type { NavItem } from '@/types/component';
import { Contact, LayoutDashboard, Moon, Scaling, Sun, Laptop } from 'lucide-vue-next';
import { RouteRecord, useRoute } from 'vue-router';
import { computed, onMounted, provide, ref } from 'vue';
import UserProfile from '@/components/layouts/UserProfile.vue';
import { useI18n } from 'vue-i18n';
import { useDarkMode } from '@/composables/useDarkMode';
import { APP_ROUTE_NAME } from '@/constants/url';

const { t: $t } = useI18n();
const { isDark, toggleDarkMode } = useDarkMode();
const pendingCounts = ref({
  pending_leaves: 0,
  pending_changes: 0,
  pending_special_works: 0,
  pending_compensation_work: 0,
  pending_special_remote_works: 0,
});

const route = useRoute();

const data: NavItem[] = [
  { title: 'common.overview', routeName: APP_ROUTE_NAME.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { title: 'common.employee', routeName: APP_ROUTE_NAME.ADMIN.USER.INDEX, icon: Contact },
];

// Add counts to sidebar data
const sidebarDataWithCounts = computed(() => {
  return data.map((item) => {
    let badge = undefined;

    return {
      ...item,
      badge: badge,
    };
  });
});

const breadcrumb = computed(() => {
  return route.matched
    .filter((item: RouteRecord) => item.meta.breadcrumb)
    .map((record: RouteRecord) => ({
      name: record.meta.breadcrumb || '',
      path: `${record.path}`,
    }));
});

</script>
