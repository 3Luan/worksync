<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { RangeCalendarHeader, type RangeCalendarHeaderProps, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<RangeCalendarHeaderProps & { class?: HTMLAttributes['class'] }>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <RangeCalendarHeader
    data-slot="range-calendar-header"
    :class="cn('flex justify-center pt-1 relative items-center w-full', props.class)"
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarHeader>
</template>
