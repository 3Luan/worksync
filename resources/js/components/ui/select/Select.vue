<script setup lang="ts">
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SelectRoot from './SelectRoot.vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    class?: string;
    data: Set<{ label: string; value: any }>;
    blank?: string;
    modelValue: any;
    translated?: boolean;
  }>(),
  {
    translated: true,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: any];
}>();

const handleValueChange = (value: any) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <SelectRoot :model-value="props.modelValue" @update:model-value="handleValueChange">
    <SelectTrigger :class="cn('w-[180px] bg-white transition-colors duration-300 cursor-pointer', props.class)">
      <SelectValue :placeholder="props.blank || $t('common.pleaseSelect')" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <template v-if="props.data && props.data.size > 0">
          <SelectItem v-for="(item, index) in Array.from(props.data)" :key="index" :value="item.value" class="cursor-pointer">
            {{ props.translated ? $t(item.label) : item.label }}
          </SelectItem>
        </template>

        <template v-else>
          <div class="px-4 py-2 text-sm text-gray-500">{{ $t('common.noData') }}</div>
        </template>
      </SelectGroup>
    </SelectContent>
  </SelectRoot>
</template>
