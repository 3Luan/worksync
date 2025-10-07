<script setup lang="ts">
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TooltipRoot from './TooltipRoot.vue';

defineProps<{
  title?: string;
}>();
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ title }}</p>
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>
</template>
