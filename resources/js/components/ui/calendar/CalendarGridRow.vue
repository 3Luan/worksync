<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { CalendarGridRow, type CalendarGridRowProps, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<CalendarGridRowProps & { class?: HTMLAttributes['class'] }>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarGridRow
    data-slot="calendar-grid-row"
    :class="cn('flex', props.class)"
    v-bind="forwardedProps"
  >
    <slot />
  </CalendarGridRow>
</template>
