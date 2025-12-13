<script setup lang="ts">
import { cn } from '@/lib/utils';
import { TagsInputItemText, type TagsInputItemTextProps, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<TagsInputItemTextProps & { class?: HTMLAttributes['class'] }>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <TagsInputItemText
    v-bind="forwardedProps"
    :class="cn('text-sm rounded bg-transparent', props.class)"
  >
    <slot />
  </TagsInputItemText>
</template>
