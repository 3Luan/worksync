<script setup lang="ts">
import { CollapsibleContent, type CollapsibleContentProps } from 'radix-vue';

const props = defineProps<CollapsibleContentProps>();
</script>

<template>
  <CollapsibleContent data-slot="collapsible-content" v-bind="props">
    <slot />
  </CollapsibleContent>
</template>
