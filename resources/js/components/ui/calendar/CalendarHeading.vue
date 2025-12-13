<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { isString } from '@/utils/types';
import { CalendarHeading, type CalendarHeadingProps, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<CalendarHeadingProps & { class?: HTMLAttributes['class'] }>();

defineSlots<{
  default: (props: { headingValue: string }) => any;
}>();

const capitalizeFirst = (value: string | Date) => {
  if (isString(value)) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
};

const forwardedProps = useForwardProps(props);
</script>

<template>
  <CalendarHeading
    v-slot="{ headingValue }"
    data-slot="calendar-heading"
    :class="cn('text-sm font-medium', props.class)"
    v-bind="forwardedProps"
  >
    <slot :heading-value>
      {{ capitalizeFirst(headingValue) }}
    </slot>
  </CalendarHeading>
</template>
