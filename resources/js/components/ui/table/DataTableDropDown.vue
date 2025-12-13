<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ActionTable } from '@/types/component';
import { MoreHorizontal } from 'lucide-vue-next';

const props = defineProps<{
  value: any;
  actions: ActionTable[];
}>();

const emits = defineEmits(['actions']);

function handleClick(key: string) {
  emits('actions', { value: props.value, key });
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="w-8 h-5 p-0 rounded-xs cursor-pointer text-gray-500 hover:!text-black hover:!bg-gray-300"
      >
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="(item, index) in actions"
        :key="index"
        class="cursor-pointer text-black"
        @click="handleClick(item.key)"
      >
        <component :is="item.icon" class="w-4 h-4" />
        <span class="dark:text-white">{{ item.title }}</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
