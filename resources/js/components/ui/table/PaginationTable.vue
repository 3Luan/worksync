<script setup lang="ts">
import { Button } from '@/components/ui/button';

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationContent,
} from '@/components/ui/pagination';
import type { PaginationType } from '@/types/component';

const modelValue = defineModel<PaginationType>({ required: true });
</script>

<template>
  <div>
    <Pagination
      v-slot="{ page }"
      :items-per-page="modelValue.perPage"
      :total="modelValue.total"
      show-edges
      :page="modelValue.page"
      @update:page="(newPage) => (modelValue.page = newPage)"
    >
      <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
        <PaginationFirst class="text-xs" />
        <PaginationPrevious />

        <template v-for="(item, index) in items">
          <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
            <Button class="w-7 h-7 p-0 transition-colors duration-300" :variant="item.value === page ? 'default' : 'outline'">
              {{ item.value }}
            </Button>
          </PaginationItem>
          <PaginationEllipsis v-else :key="item.type" :index="index" />
        </template>

        <PaginationNext />
        <PaginationLast />
      </PaginationContent>
    </Pagination>
  </div>
</template>
