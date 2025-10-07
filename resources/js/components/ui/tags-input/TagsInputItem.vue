<script setup lang="ts">
import { cn } from '@/lib/utils';
import { TagsInputItem, type TagsInputItemProps, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<TagsInputItemProps & { class?: HTMLAttributes['class'] }>();
const forwardedProps = useForwardProps(props);
</script>

<template>
  <TagsInputItem v-bind="forwardedProps" :class="cn('flex items-center rounded-md bg-secondary data-[state=active]:ring-ring data-[state=active]:ring-2 data-[state=active]:ring-offset-2 ring-offset-background', props.class)">
    <slot />
  </TagsInputItem>
</template>
