<script setup lang="ts">
import type { ComboboxTriggerProps } from 'reka-ui';
import { cn } from '@/lib/utils';
import { ComboboxTrigger, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<ComboboxTriggerProps & { class?: HTMLAttributes['class'] }>();

const forwarded = useForwardProps(props);
</script>

<template>
  <ComboboxTrigger
    data-slot="combobox-trigger"
    v-bind="forwarded"
    :class="cn('', props.class)"
    tabindex="0"
  >
    <slot />
  </ComboboxTrigger>
</template>
