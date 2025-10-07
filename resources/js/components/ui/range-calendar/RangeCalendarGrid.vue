<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { RangeCalendarGrid, type RangeCalendarGridProps, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<RangeCalendarGridProps & { class?: HTMLAttributes['class'] }>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarGrid data-slot="range-calendar-grid" :class="cn('w-full border-collapse space-x-1', props.class)" v-bind="forwardedProps">
    <slot />
  </RangeCalendarGrid>
</template>
