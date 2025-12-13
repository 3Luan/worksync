<script setup lang="ts">
import type { ComboboxAnchorProps } from 'reka-ui';
import { cn } from '@/lib/utils';
import { ComboboxAnchor, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<ComboboxAnchorProps & { class?: HTMLAttributes['class'] }>();

const forwarded = useForwardProps(props);
</script>

<template>
  <ComboboxAnchor
    data-slot="combobox-anchor"
    v-bind="forwarded"
    :class="cn('w-[200px]', props.class)"
  >
    <slot />
  </ComboboxAnchor>
</template>
