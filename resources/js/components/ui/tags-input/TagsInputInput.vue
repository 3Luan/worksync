<script setup lang="ts">
import { cn } from '@/lib/utils';
import { TagsInputInput, type TagsInputInputProps, useForwardProps } from 'reka-ui';
import { type HTMLAttributes } from 'vue';

const props = defineProps<TagsInputInputProps & { class?: HTMLAttributes['class'] }>();

const forwardedProps = useForwardProps(props);
</script>

<template>
  <TagsInputInput v-bind="forwardedProps" :class="cn('text-sm focus:outline-none bg-transparent transition-colors duration-300', props.class)" />
</template>
