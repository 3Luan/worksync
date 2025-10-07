<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();
</script>

<template>
  <tr data-slot="table-row" :class="cn('hover:bg-gray-200 dark:hover:bg-gray-900 data-[state=selected]:bg-muted transition-colors', props.class)">
    <slot />
  </tr>
</template>
