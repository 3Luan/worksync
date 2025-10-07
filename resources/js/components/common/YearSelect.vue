<template>
  <SelectRoot :model-value="internalValue" @update:model-value="handleValueChange">
    <SelectTrigger :class="cn('min-w-[100px] bg-white transition-colors duration-300 border-black dark:border-gray-300 cursor-pointer', props.class)">
      <SelectValue :placeholder="$t('common.pleaseSelect')" />
    </SelectTrigger>
    <SelectContent>
      <template v-if="yearOptions.length > 0">
        <div class="grid grid-cols-3 gap-2 max-h-[204px] overflow-y-auto p-1">
          <SelectItem v-for="(item, index) in yearOptions" :key="item.value" :value="item.value" class="text-center cursor-pointer">
            {{ item.label }}
          </SelectItem>
        </div>
      </template>
      <template v-else>
        <div class="px-4 py-2 text-sm text-gray-500">{{ $t('common.noData') }}</div>
      </template>
    </SelectContent>
  </SelectRoot>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { SelectRoot, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DEFAULT_START_YEAR, DEFAULT_YEAR_RANGE } from '@/constants';

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  customOptions: {
    type: Array,
    default: () => [],
  },
  startYear: {
    type: Number,
    default: null,
  },
  endYear: {
    type: Number,
    default: null,
  },
  class: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal;
  },
);

const yearOptions = computed(() => {
  if (Array.isArray(props.customOptions) && props.customOptions.length > 0) {
    return props.customOptions.map((option) => ({
      value: option.value,
      label: option.label,
    }));
  }
  const currentYear = new Date().getFullYear();
  const resolvedEndYear = props.endYear ?? currentYear;
  const resolvedStartYear = props.startYear ?? (resolvedEndYear < DEFAULT_START_YEAR ? resolvedEndYear - DEFAULT_YEAR_RANGE : DEFAULT_START_YEAR);

  const length = resolvedEndYear - resolvedStartYear + 1;

  return Array.from({ length }, (_, i) => {
    const year = resolvedEndYear - i;
    return {
      value: year,
      label: `${year}`,
    };
  });
});

const handleValueChange = (value) => {
  internalValue.value = value;
  emit('update:modelValue', value);
};
</script>
