<script setup lang="ts">
import { nextTick, watch, ref, onMounted, computed, onBeforeUnmount, inject, type Ref as VueRef } from 'vue';
import { useRoute } from 'vue-router';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  SendHorizontal,
  ChevronRight,
  Scaling,
  CheckSquare,
  Calendar,
  CalendarHeart,
  ListX,
  Contact,
  CalendarPlus2,
  ListStart,
  Laptop,
} from 'lucide-vue-next';
import { ROLE, ROLE_STAFF } from '@/constants/index';
import { APP_ROUTE_NAME } from '@/constants/url';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/model';
import type { NavItem, SubItem } from '@/types/component';
import { useI18n } from 'vue-i18n';
import { Tooltip } from '@/components/ui/tooltip';
import { formatBadge } from '@/utils/sidebar';
import { useSidebarTooltip } from '@/composables/useSidebarTooltip';

const openTooltipIndex = ref<number | null>(null);
const { tooltipShown, createLabelRef, measureAll } = useSidebarTooltip();
const keyOf = (item: NavItem) => item.routeName || String(item.title);
const closeAllTooltips = () => (openTooltipIndex.value = null);
const { t: $t } = useI18n();
const route = useRoute();
const user = useAuthStore();
const menuRef = ref<HTMLElement | null>(null);

// Inject badge counts from UserLayout
const badgeCounts = inject<VueRef<Record<string, number>>>('badgeCounts', ref<Record<string, number>>({}));

// Define all menu items
const allMenuItems: NavItem[] = [
  {
    icon: LayoutDashboard,
    title: 'common.dashboard',
    routeName: APP_ROUTE_NAME.USER.DASHBOARD,
    requiredRoles: ROLE_STAFF,
  },
  {
    icon: Clock,
    title: 'common.worksync',
    routeName: APP_ROUTE_NAME.USER.WORKSYNC,
    requiredRoles: [ROLE.LEADER, ROLE.STAFF],
  },
  {
    icon: Contact,
    title: 'common.employee',
    routeName: APP_ROUTE_NAME.USER.INDEX,
    requiredRoles: [ROLE.ACCOUNTANT],
  },
];

// Filter menu items based on user role
const menuItems = computed(() => {
  return allMenuItems
    .filter((item) => {
      if (item.requiredRoles) {
        const userRole: UserRole | undefined = user.user?.role;
        return userRole !== undefined && item.requiredRoles.includes(userRole as (typeof item.requiredRoles)[number]);
      }
      return true;
    })
    .map((item) => {
      // Add badge counts from UserLayout
      const badgeCount = badgeCounts.value[item.routeName || ''];
      if (badgeCount && badgeCount > 0) {
        return { ...item, badge: badgeCount };
      }
      return item;
    });
});

const props = defineProps<{
  isMobileMenuOpen: boolean;
  isMobile: boolean;
}>();

const emits = defineEmits<{
  (name: 'navigate', routeName?: string): void;
  (name: 'closeMobileMenu'): void;
}>();

const expandedItems = ref<Record<string, boolean>>({});

// Check if item has valid badge
function hasBadge(item: NavItem): item is NavItem & { badge: number } {
  return 'badge' in item && typeof (item as { badge?: unknown }).badge === 'number' && ((item as { badge?: number }).badge as number) > 0;
}

const toggleSubmenu = (index: number) => {
  expandedItems.value = {
    ...expandedItems.value,
    [index]: !expandedItems.value[index],
  };
};

const isActive = (itemRoute?: string) => {
  if (!itemRoute) return false;
  return route.name === itemRoute;
};

const isSubmenuActive = (item: NavItem) => {
  if (!item.submenu) return false;
  return item.submenu.some((subItem: SubItem) => route.name === subItem.routeName);
};

const closeMobileMenu = () => {
  emits('closeMobileMenu');
};

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node) && props.isMobile) {
    closeMobileMenu();
  }
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeAllTooltips();
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
// Auto-expand active submenus when component is mounted
onMounted(() => {
  menuItems.value.forEach((item, index) => {
    if (item.submenu && isSubmenuActive(item)) {
      expandedItems.value[index] = true;
    }
  });
});

watch(
  () => route.fullPath,
  async () => {
    await nextTick();
    measureAll();
  },
);

watch(
  () => props.isMobileMenuOpen,
  async (isCollapsed) => {
    await nextTick();
    if (!isCollapsed) measureAll();
  },
);
</script>

<template>
  <div class="h-[calc(100vh-4rem)]">
    <!-- Sidebar content -->
    <div
      ref="menuRef"
      data-sidebar-root
      :class="[
        'top-16 z-30 bottom-0 border-r bg-card shadow-lg pointer-events-auto transition-all duration-300 ease-in-out',
        isMobile ? 'absolute bg-amber-200 h-[calc(100%+40px)]' : 'h-full',
        isMobileMenuOpen ? (isMobile ? 'w-[0px] overflow-x-hidden left-[-4px]' : 'w-[72px] overflow-x-hidden') : 'w-64 left-0',
      ]"
    >
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto py-4 overflow-x-hidden">
          <div class="px-3 space-y-1">
            <div v-for="(item, index) in menuItems" :key="item.routeName" class="relative">
              <!-- Main menu item -->
              <button
                @click.stop="item.submenu ? toggleSubmenu(index) : $emit('navigate', item.routeName)"
                :class="{
                  'flex items-center justify-between w-full pl-3 py-2 rounded-md text-sm transition-colors duration-200 cursor-pointer': true,
                  ' text-white font-medium bg-black dark:text-black dark:bg-gray-300': isActive(item.routeName) || isSubmenuActive(item),
                  'hover:bg-muted': !isActive(item.routeName) && !isSubmenuActive(item),
                  'justify-between': item.submenu,
                }"
              >
                <div class="flex items-center gap-2">
                  <div class="relative">
                    <Tooltip v-if="isMobileMenuOpen" :title="$t(item.title)" side="right" :side-offset="12" align="center">
                      <component :is="item.icon" class="h-5 w-5" :aria-label="$t(item.title)" />
                    </Tooltip>
                    <component v-else :is="item.icon" class="h-5 w-5" />
                    <!-- Badge for collapsed sidebar -->
                    <span
                      v-if="isMobileMenuOpen && hasBadge(item)"
                      class="absolute -top-4 -right-5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white border border-background"
                    >
                      {{ formatBadge(item.badge) }}
                    </span>
                  </div>
                  <Tooltip v-if="!isMobileMenuOpen" :title="$t(item.title)" :disabled="!tooltipShown[keyOf(item)]">
                    <span class="sidebar-content truncate max-w-[200px]" :ref="createLabelRef(keyOf(item))">
                      {{ $t(item.title) }}
                    </span>
                  </Tooltip>
                </div>

                <div v-if="!isMobileMenuOpen" class="flex items-center sidebar-content">
                  <!-- Badge Circle -->
                  <span
                    v-if="hasBadge(item)"
                    class="ml-auto mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white"
                  >
                    {{ formatBadge(item.badge) }}
                  </span>
                  <ChevronRight v-if="item.submenu" class="h-4 w-4 transition-transform duration-200" :class="{ 'rotate-90': expandedItems[index] }" />
                </div>
              </button>

              <!-- Submenu -->
              <transition
                enter-active-class="transition-all duration-300 ease-in-out"
                enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-[500px] opacity-100"
                leave-active-class="transition-all duration-200 ease-in-out"
                leave-from-class="max-h-[500px] opacity-100"
                leave-to-class="max-h-0 opacity-0"
                v-if="!isMobileMenuOpen"
              >
                <div v-if="item.submenu && expandedItems[index]" class="overflow-hidden">
                  <div class="pl-10 pr-3 py-1 space-y-1">
                    <button
                      v-for="subItem in item.submenu"
                      :key="subItem.routeName"
                      @click.stop="$emit('navigate', subItem.routeName)"
                      :class="{
                        'flex items-center w-full py-2 rounded-md text-sm transition-colors duration-200 cursor-pointer': true,
                        'bg-primary/10 text-primary font-medium': isActive(subItem.routeName),
                        'hover:bg-muted': !isActive(subItem.routeName),
                      }"
                      :variant="isActive(subItem.routeName) ? 'default' : 'ghost'"
                    >
                      {{ subItem.title }}
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div class="p-4 border-t" v-if="!isMobile">
          <div class="flex items-center space-x-3 cursor-pointer" @click="closeMobileMenu">
            <div class="h-8 w-8 flex items-center justify-center">
              <SendHorizontal :class="['h-7 w-7 transition-transform duration-500', isMobileMenuOpen ? 'rotate-180' : 'rotate-0']" :size="30" />
            </div>
            <div class="sidebar-content flex justify-center items-center">
              <p class="text-base text-muted-foreground transition-colors duration-300" v-if="!isMobileMenuOpen">{{ $t('common.collapse') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-content {
  white-space: nowrap;
  overflow: hidden;
  transition: opacity 150ms ease-in-out;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
