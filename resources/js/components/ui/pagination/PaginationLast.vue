<script setup lang="ts">
import type { PaginationLastProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';
import { buttonVariants, type ButtonVariants } from '@/components/ui/button';
import { reactiveOmit } from '@vueuse/core';
import { ChevronLast } from 'lucide-vue-next';
import { PaginationLast, useForwardProps } from 'reka-ui';

const props = withDefaults(
  defineProps<
    PaginationLastProps & {
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
  <PaginationLast data-slot="pagination-last" :class="cn(buttonVariants({ variant: 'ghost', size }), 'gap-1 h-7 w-7', props.class)" v-bind="forwarded">
    <slot>
      <ChevronLast />
    </slot>
  </PaginationLast>
</template>
