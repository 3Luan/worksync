<script setup lang="ts">
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip/index';
import { type Component, computed } from 'vue';
import SidebarMenuButtonChild, { type SidebarMenuButtonProps } from './SidebarMenuButtonChild.vue';
import { useSidebar } from '@/components/ui/sidebar/utils';
import { formatBadge } from '@/utils/sidebar';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<
    SidebarMenuButtonProps & {
      tooltip?: string | Component;
      badge?: number;
      disabledTooltip?: boolean;
    }
  >(),
  {
    as: 'button',
    variant: 'default',
    size: 'default',
    badge: 0,
    disabledTooltip: false,
  },
);

const { state } = useSidebar();
const isCollapsed = computed(() =>
  state.value === 'collapsed' ? '-top-2 -right-2' : 'top-[10px] right-0',
);
const delegatedProps = computed(() => {
  const { tooltip, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <SidebarMenuButtonChild
    v-if="!tooltip"
    v-bind="{ ...delegatedProps, ...$attrs }"
    class="!relative flex items-center"
  >
    <slot />
    <template #badge>
      <!-- Badge Circle -->
      <span
        v-if="props.badge && Number(props.badge) > 0"
        :class="[
          'absolute flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white z-[100]',
          isCollapsed,
        ]"
      >
        {{ formatBadge(props.badge) }}
      </span>
    </template>
  </SidebarMenuButtonChild>

  <Tooltip v-else :disabled="disabledTooltip" :title="tooltip as string">
    <TooltipTrigger as-child>
      <div class="relative">
        <SidebarMenuButtonChild v-bind="{ ...delegatedProps, ...$attrs }">
          <slot />
        </SidebarMenuButtonChild>
        <span
          v-if="props.badge && Number(props.badge) > 0"
          :class="[
            'absolute z-[10] flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white',
            isCollapsed,
          ]"
        >
          {{ formatBadge(props.badge) }}
        </span>
      </div>
    </TooltipTrigger>
  </Tooltip>
</template>
