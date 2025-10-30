<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { SidebarProps } from '@/components/ui/sidebar/index';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar/index';
import SidebarHeader from '@/components/ui/sidebar/SidebarHeader.vue';
// import { LOGO_GREEN, LOGO_STIKY } from '@/settings/image';
import type { NavItem } from '@/types/component';
import { ChevronRight } from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';
import { APP_URL } from '@/constants/url';
import { nextTick, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Tooltip from '../tooltip/Tooltip.vue';
import { useSidebarTooltip } from '@/composables/useSidebarTooltip';
import { LOGO_WORKSYNC } from '@/constants/imageConst';

const { tooltipShown, createLabelRef, measureAll } = useSidebarTooltip();

interface CustomSidebarProps extends SidebarProps {
  data: NavItem[];
}

const props = withDefaults(defineProps<CustomSidebarProps>(), {
  collapsible: 'icon',
  data: () => [],
});

const router = useRouter();
const route = useRoute();
const { t: $t } = useI18n();
const labelOf = (item: NavItem) => (item.isTranslated ? String(item.title) : $t(String(item.title)));
const keyOf = (item: NavItem) => item.routeName || String(item.title);

/**
 * Function to navigate to a specific route by its name
 * @param routeName
 */
const navigateTo = (routeName: string) => {
  if (routeName) {
    setOpenMobile(false);
    router.push({ name: routeName });
  }
};

/**
 * Function to check if the current route matches the given route name
 * @param routeName
 */
const isActive = (routeName?: string): boolean => {
  if (!routeName) return false;
  return route.name === routeName;
};

/**
 * Function to check if any sub-item of a navigation item is active
 * @param item
 */
const isAnySubItemActive = (item: NavItem): boolean => {
  return item.submenu?.some((subItem) => isActive(subItem.routeName)) ?? false;
};

const { open, setOpenMobile } = useSidebar();

watch(open, async (val) => {
  if (!val) return;
  await nextTick();
  measureAll();
});
</script>

<template>
  <Sidebar v-bind="props" data-sidebar-root class="border-r transition-colors duration-300 border-b border-gray-300 dark:border-gray-600">
    <SidebarHeader>
      <Collapsible>
        <div :class="[' w-full flex flex-row justify-center items-center py-1 ', { 'h-28': open }]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-indigo-400 dark:text-indigo-500 drop-shadow-md h-[100%] max-h-20 cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
            v-if="open"
            @click="() => router.push(APP_URL.ADMIN.DASHBOARD)"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.73 9.73 0 01-4.28-.95L3 20l1.19-3.58A7.49 7.49 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-indigo-400 dark:text-indigo-500 drop-shadow-md min-w-[30px] w-[20%] cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.3"
            v-else
            @click="() => router.push(APP_URL.ADMIN.DASHBOARD)"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.73 9.73 0 01-4.28-.95L3 20l1.19-3.58A7.49 7.49 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
      </Collapsible>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          <template v-for="item in props.data" :key="keyOf(item)">
            <Collapsible v-if="item.submenu" as-child :default-open="isAnySubItemActive(item) || isActive(item.routeName)" class="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger as-child>
                  <SidebarMenuButton
                    as-child
                    class="h-10"
                    :is-active="!!item.routeName && isActive(item.routeName)"
                    :badge="item.badge"
                    :disabled-tooltip="open ? !tooltipShown[keyOf(item)] : false"
                    :tooltip="labelOf(item)"
                  >
                    <span @click="item.routeName && navigateTo(item.routeName)" class="flex items-center cursor-pointer">
                      <component :is="item.icon" v-if="item.icon" class="mr-2 h-10 w-10 scale-125" />
                      <span :class="['truncate max-w-[200px]', { 'font-bold': !!item.routeName && isActive(item.routeName) }]">
                        {{ item.isTranslated ? item.title : $t(item.title) }}
                      </span>
                      <ChevronRight class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem v-for="subItem in item.submenu" :key="keyOf(subItem)">
                      <SidebarMenuSubButton as-child :is-active="isActive(subItem.routeName)" class="h-8">
                        <span @click="navigateTo(subItem.routeName)" class="cursor-pointer">
                          <Tooltip :title="String(subItem.title)">
                            <span :class="['text-sm truncate max-w-[200px]', { 'font-semibold': isActive(subItem.routeName) }]">
                              {{ subItem.title }}
                            </span>
                          </Tooltip>
                        </span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>

            <SidebarMenuItem v-else>
              <SidebarMenuButton
                as-child
                :is-active="isActive(item.routeName)"
                class="h-10"
                :badge="item.badge"
                :disabled-tooltip="open ? !tooltipShown[keyOf(item)] : false"
                :tooltip="labelOf(item)"
              >
                <span class="flex items-center cursor-pointer" @click="item.routeName && navigateTo(item.routeName)">
                  <component :is="item.icon" v-if="item.icon" class="mr-2 h-6 w-6 scale-125" />
                  <span
                    v-show="open"
                    :data-key="keyOf(item)"
                    data-ellipsis-label
                    :ref="createLabelRef(keyOf(item))"
                    :class="['block truncate max-w-[200px]', { 'font-bold': isActive(item.routeName) }]"
                  >
                    {{ labelOf(item) }}
                  </span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </template>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <!-- <SidebarRail /> -->
  </Sidebar>
</template>
