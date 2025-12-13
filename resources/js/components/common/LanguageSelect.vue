<template>
  <SelectRoot :model-value="currentLang" @update:model-value="changeLanguage">
    <SelectTrigger
      class="w-fit bg-white z-1 mr-2 transition-colors duration-300 border-black dark:border-gray-300 cursor-pointer"
    >
      <SelectValue>
        <img :src="currentOption?.icon" alt="" class="inline-block h-4 w-5" />
        {{ currentOption?.label }}
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <template v-if="languageOptions.size > 0">
        <div class="flex flex-col gap-2 max-h-[204px] overflow-y-auto p-1">
          <SelectItem
            v-for="item in languageOptions"
            :key="item.value"
            :value="item.value"
            class="text-center cursor-pointer"
          >
            <img :src="item.icon" alt="" class="inline-block mr-2 h-4 w-5" />
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

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { setI18nLanguage } from '@/plugins/i18n';
import {
  SelectRoot,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LANGUAGE_OPTIONS } from '@/constants/i18n';
import { AcceptableValue } from 'reka-ui';
import { isString } from '@/utils/types';

const { locale } = useI18n();
const currentLang = ref(locale.value);
const languageOptions = new Set(LANGUAGE_OPTIONS);

const currentOption = computed(() => {
  const option = Array.from(languageOptions).find((item) => item.value === currentLang.value);
  return option;
});

const changeLanguage = async (value: AcceptableValue) => {
  if (isString(value)) {
    currentLang.value = value;
    await setI18nLanguage(value);
  }
};
</script>
