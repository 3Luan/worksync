<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { PanelLeftOpen } from 'lucide-vue-next';
import { useSidebar } from './utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { open, toggleSidebar } = useSidebar();
</script>

<template>
  <div
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    :class="cn('h-7 w-7 flex flex-row justify-center items-center', props.class)"
    @click="toggleSidebar"
  >
    <component
      :is="PanelLeftOpen"
      :size="22"
      :class="[
        'transition-colors duration-300 text-black dark:text-white',
        open ? 'rotate-180' : 'rotate-0',
      ]"
    />
  </div>
</template>
