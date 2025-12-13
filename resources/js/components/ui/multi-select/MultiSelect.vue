<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { cn } from '@/lib/utils';
import { ComboboxInput } from 'reka-ui';
import {
  ComboboxRoot,
  ComboboxAnchor,
  ComboboxList,
  ComboboxTrigger,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxItemIndicator,
} from '@/components/ui/combobox';
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input';
import { Check, ChevronDown, LoaderCircle } from 'lucide-vue-next';

const props = defineProps<{
  modelValue: { value: string | number; label: string }[];
  loading: boolean;
  maxVisibleTags: number;
  options: { value: string | number; label: string }[];
  class?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { value: string | number; label: string }[]): void;
  (e: 'loadMore'): void;
}>();

const searchTerm = ref('');

const values = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const visibleTags = computed(() => values.value.slice(0, props.maxVisibleTags));
const remainingCount = computed(() => values.value.length - props.maxVisibleTags);

watch(
  values,
  () => {
    searchTerm.value = '';
  },
  { deep: true },
);

const onScroll = (event: Event) => {
  const content = event.target as HTMLElement;
  // Check if the user has scrolled to the near bottom of the list
  const isAtBottom = content.scrollHeight - content.scrollTop - content.clientHeight < 10;

  if (isAtBottom) {
    emit('loadMore');
  }
};
</script>

<template>
  <ComboboxRoot v-model="values" v-model:search-term="searchTerm" multiple class="mx-auto relative">
    <ComboboxAnchor
      :class="
        cn(
          'w-full min-w-[200px] h-9 inline-flex items-center justify-between rounded-md border border-input bg-background p-2 text-[13px] leading-none gap-[5px] transition-colors duration-300 focus-within:ring-3 focus-within:ring-black/18 focus-within:shadow-lg',
          props.class,
        )
      "
    >
      <TagsInput
        v-model="values"
        class="flex-grow flex flex-nowrap gap-2 items-center rounded-lg border-0 p-0 transition-colors duration-300 bg-transparent"
      >
        <TagsInputItem
          v-for="(item, index) in visibleTags"
          :key="index"
          :value="item"
          class="flex items-center justify-center gap-2 text-white bg-green-600 rounded-md py-1 px-2"
        >
          <TagsInputItemText class="text-sm text-nowrap">
            {{ item.label }}
          </TagsInputItemText>
          <TagsInputItemDelete class="cursor-pointer" />
        </TagsInputItem>

        <span
          v-if="remainingCount > 0"
          class="text-sm bg-gray-200 text-gray-600 rounded-md py-1 px-2 text-nowrap"
        >
          +{{ remainingCount }} more
        </span>

        <ComboboxInput v-model="searchTerm" as-child>
          <TagsInputInput
            :placeholder="$t('common.searchPlaceholder')"
            class="w-full min-w-[30px] p-0.5 border-none text-primary h-auto"
            @keydown.enter.prevent
          />
        </ComboboxInput>
      </TagsInput>

      <ComboboxTrigger class="cursor-pointer">
        <ChevronDown class="h-4 w-4 opacity-50" />
      </ComboboxTrigger>
    </ComboboxAnchor>
    <ComboboxList class="w-full min-w-[300px] mt-2 bg-background rounded-md overflow-hidden">
      <div class="p-[5px] max-h-[234px] overflow-y-auto" v-on:scroll="onScroll">
        <ComboboxEmpty class="text-[13px]text-center py-2">
          {{ $t('common.noData') }}
        </ComboboxEmpty>
        <ComboboxGroup>
          <ComboboxItem
            v-for="(option, index) in options"
            :key="index"
            class="text-[13px] leading-none rounded-sm py-1.5 pr-2 pl-1 flex items-center relative hover:bg-accent hover:text-accent-foreground"
            :value="option"
          >
            <ComboboxItemIndicator
              class="absolute left-0 w-[25px] inline-flex items-center justify-center"
            >
              <Check class="h-4 w-4 text-green-600" />
            </ComboboxItemIndicator>
            <span class="text-sm">
              {{ option.label }}
            </span>
          </ComboboxItem>
        </ComboboxGroup>
        <div v-if="loading" class="h-8 flex justify-center items-center">
          <LoaderCircle class="w-6 h-6 animate-spin text-gray-600" />
        </div>
      </div>
    </ComboboxList>
  </ComboboxRoot>
</template>
