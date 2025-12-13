<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox';
import { Check, ChevronsUpDown, Search, X } from 'lucide-vue-next';
import { computed } from 'vue';
import ComboboxRoot from './ComboboxRoot.vue';

const props = withDefaults(
  defineProps<{
    class?: string;
    options: Array<{ label: any; value: any }>;
    blank?: string;
    isSearch?: boolean;
    clearable?: boolean;
  }>(),
  {
    isSearch: true,
    clearable: false,
  },
);

const modelValue = defineModel<any>();

const label = computed(() => {
  return props.options.find(
    (item: { label: string; value: any }) => item.value === modelValue.value,
  )?.label;
});

const clearValue = () => {
  modelValue.value = null;
};
</script>

<template>
  <ComboboxRoot v-model="modelValue" class="relative !cursor-pointer">
    <X
      v-if="clearable && modelValue"
      class="w-4 h-4 absolute top-1/2 right-7 -translate-y-1/2 hover:text-black text-gray-500 text-sm"
      @click="clearValue"
    />
    <ComboboxAnchor as-child :class="cn($props.class)">
      <ComboboxTrigger as-child>
        <Button variant="outline" class="justify-between min-w-20">
          {{ label ?? $t('common.pleaseSelect') }}
          <ChevronsUpDown class="mr-0 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxList>
      <div class="relative w-full max-w-sm items-center" v-if="isSearch">
        <ComboboxInput
          class="focus-visible:ring-0 border-0 rounded-none h-10"
          :placeholder="$t('common.searchPlaceholder')"
        />
        <span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
          <Search class="size-4 text-muted-foreground" />
        </span>
      </div>

      <ComboboxEmpty>{{ $t('common.notFound') }}</ComboboxEmpty>

      <ComboboxGroup>
        <ComboboxItem v-for="(item, index) in props.options" :key="index" :value="item.value">
          {{ item.label }}
          <ComboboxItemIndicator>
            <Check :class="cn('ml-auto h-4 w-4')" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxGroup>
    </ComboboxList>
  </ComboboxRoot>
</template>
