<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRight } from 'lucide-vue-next';
import { RangeCalendarNext, type RangeCalendarNextProps, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<RangeCalendarNextProps & { class?: HTMLAttributes['class'] }>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarNext
    data-slot="range-calendar-next-button"
    :class="cn(buttonVariants({ variant: 'outline' }), 'absolute right-1', 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100', props.class)"
    v-bind="forwardedProps"
  >
    <slot>
      <ChevronRight class="size-4" />
    </slot>
  </RangeCalendarNext>
</template>
