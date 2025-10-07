<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { CalendarGrid, type CalendarGridProps, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<CalendarGridProps & { class?: HTMLAttributes['class'] }>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarGrid data-slot="calendar-grid" :class="cn('w-full border-collapse space-x-1', props.class)" v-bind="forwardedProps">
    <slot />
  </CalendarGrid>
</template>
