<script setup lang="ts">
import type { PaginationFirstProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { buttonVariants, type ButtonVariants } from '@/components/ui/button';
import { reactiveOmit } from '@vueuse/core';
import { ChevronFirst } from 'lucide-vue-next';
import { PaginationFirst, useForwardProps } from 'reka-ui';

const props = withDefaults(
  defineProps<
    PaginationFirstProps & {
      size?: ButtonVariants['size'];
      class?: HTMLAttributes['class'];
    }
  >(),
  {
    size: 'default',
  },
);

const delegatedProps = reactiveOmit(props, 'class', 'size');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <PaginationFirst data-slot="pagination-first" :class="cn(buttonVariants({ variant: 'ghost', size }), 'gap-1 h-7 w-7', props.class)" v-bind="forwarded">
    <slot>
      <ChevronFirst />
    </slot>
  </PaginationFirst>
</template>
