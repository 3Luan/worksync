<script setup lang="ts">
import { cn } from '@/lib/utils';
import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';
import { ref, Ref, watch, computed } from 'vue';
import Popover from '../popover/Popover.vue';
import PopoverTrigger from '../popover/PopoverTrigger.vue';
import Button from '../button/Button.vue';
import PopoverContent from '../popover/PopoverContent.vue';
import Calendar from './Calendar.vue';
import { useI18n } from 'vue-i18n';

import { useCommon } from '@/composables/useCommon';
import { WeekdayFormat } from '@/enums';

const { getDayName } = useCommon();

const { locale, t: $t } = useI18n();
const parseDateString = (dateString?: string): DateValue | null => {
  if (!dateString) return null;

  const date = new Date(dateString);
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
};

const value = defineModel<string>();
const date = ref(parseDateString(value.value)) as Ref<DateValue>;

const dateFormatter = computed(
  () =>
    new DateFormatter(locale.value, {
      dateStyle: WeekdayFormat.Long,
    }),
);

const props = defineProps<{
  disable?: boolean;
  onDisableDates?: (date: DateValue) => boolean;
  classButton?: string;
}>();

const disableDates = (date: DateValue) => {
  if (props.disable) return true;

  if (props.onDisableDates) {
    return props.onDisableDates(date);
  }

  return false;
};

watch(
  () => date.value,
  (newVal: DateValue) => {
    value.value = newVal?.toString?.() ?? '';
  },
);

watch(
  () => value.value,
  (newVal) => {
    const dateString = date.value?.toString?.() ?? '';
    if (newVal === dateString) return;

    const parsedDate = parseDateString(newVal);
    if (parsedDate && parsedDate.toString() !== dateString) {
      date.value = parsedDate;
    }
  },
);

const displayDate = computed(() => {
  if (!date.value) return $t('common.selectDate');
  const localDate = date.value.toDate(getLocalTimeZone());
  return `${getDayName(localDate.toISOString())}, ${dateFormatter.value.format(localDate)}`;
});
</script>

<template>
  <div class="flex flex-col items-start gap-4 md:flex-row">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          :class="cn('min-w-[150px] h-[36px] justify-start px-2 font-normal custom-open-ring', !date && 'text-muted-foreground', props.classButton)"
        >
          <CalendarIcon class="text-muted-foreground" />
          {{ displayDate }}
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0" align="start">
        <Calendar v-model="date" initial-focus :is-date-disabled="disableDates" :locale="locale" />
      </PopoverContent>
    </Popover>
  </div>
</template>
