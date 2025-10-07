<script setup lang="ts">
import TooltipRoot from './TooltipRoot.vue';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { AlignType, SideType } from '@/enums';
import { TooltipArrow } from 'reka-ui';

defineProps<{
  side?: SideType;
  align?: AlignType;
}>();
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger as-child class="hidden md:block">
        <slot name="trigger" />
      </TooltipTrigger>
      <TooltipContent :side="side || SideType.Top" :align="align || AlignType.Center">
        <slot name="content" />
      </TooltipContent>
    </TooltipRoot>
  </TooltipProvider>

  <Popover side="bottom">
    <PopoverTrigger as-child class="block md:hidden">
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverContent
      class="border-none bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance"
    >
      <slot name="content" />
      <TooltipArrow class="bg-primary fill-primary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
    </PopoverContent>
  </Popover>
</template>
