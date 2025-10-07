<script setup lang="ts">
import type { AvatarImageProps } from 'radix-vue';
import { AvatarImage } from 'radix-vue';

const props = defineProps<AvatarImageProps>();
</script>

<template>
  <AvatarImage data-slot="avatar-image" v-bind="props" class="aspect-square size-full">
    <slot />
  </AvatarImage>
</template>
