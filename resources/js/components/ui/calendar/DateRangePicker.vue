<script setup lang="ts">
import { cn } from '@/lib/utils';
import { CalendarDate, type DateValue, getLocalTimeZone } from '@internationalized/date';
import { CalendarIcon, CircleX } from 'lucide-vue-next';
import Popover from '../popover/Popover.vue';
import PopoverTrigger from '../popover/PopoverTrigger.vue';
import Button from '../button/Button.vue';
import PopoverContent from '../popover/PopoverContent.vue';
import RangeCalendar from '../range-calendar/RangeCalendar.vue';
import { Ref, ref, watch } from 'vue';
import type { DateRange } from '@/types/component';
import { useI18n } from 'vue-i18n';
import { formatLocalizedDate } from '@/utils/time';

const { locale } = useI18n();
interface NullableDateRange {
  start?: DateValue;
  end?: DateValue;
}

const dateRange = defineModel<DateRange>({ required: true });

const date = ref<NullableDateRange>({
  start: undefined,
  end: undefined,
}) as Ref<{ start: DateValue | undefined; end: DateValue | undefined }>;

const props = withDefaults(
  defineProps<{
    id?: string;
    disable?: boolean;
    placeholder?: string;
    onDisableDates?: (date: DateValue) => boolean;
    allowClear?: boolean;
    classButton?: string;
  }>(),
  {
    id: 'date',
  },
);

const formatFullDate = (date: DateValue | undefined): string | null => {
  if (!date) return null;
  const d = date.toDate(getLocalTimeZone());
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

watch(
  () => date.value,
  (newVal) => {
    const start = formatFullDate(newVal.start);
    const end = formatFullDate(newVal.end);
    dateRange.value = { start, end };
  },
);

const updateDateRange = (value: DateRange) => {
  let updateDate: NullableDateRange = {
    start: undefined,
    end: undefined,
  };
  if (value?.start) {
    const startDate = new Date(value.start);
    updateDate.start = new CalendarDate(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate());
  }
  if (value?.end) {
    const endDate = new Date(value.end);
    updateDate.end = new CalendarDate(endDate.getFullYear(), endDate.getMonth() + 1, endDate.getDate());
  }
  date.value = {
    start: updateDate.start,
    end: updateDate.end,
  };
};

watch(
  () => dateRange.value,
  (newVal, oldVal) => {
    if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
    updateDateRange(newVal);
  },
);

updateDateRange(dateRange.value);

const disableDates = (date: DateValue) => {
  if (props.disable) return true;

  if (props.onDisableDates) {
    return props.onDisableDates(date);
  }

  return false;
};

const removeDate = () => {
  date.value = {
    start: undefined,
    end: undefined,
  };
  dateRange.value = { start: '', end: '' };
};
</script>

<template>
  <div class="flex flex-col items-start gap-4 md:flex-row">
    <Popover>
      <PopoverTrigger as-child>
        <Button
          :id="id"
          variant="outline"
          :class="
            cn(
              'w-full justify-start px-2 font-normal custom-open-ring dark:border dark:border-gray-300 dark:rounded-md',
              !date && 'text-muted-foreground',
              props.classButton,
            )
          "
        >
          <CalendarIcon class="text-muted-foreground transition-colors duration-300" />

          <template v-if="date.start">
            <template v-if="date.end">
              {{ formatLocalizedDate({ date: date.start, locale }) }} - {{ formatLocalizedDate({ date: date.end, locale }) }}
              <span @click.stop="removeDate" v-if="props.allowClear"> <CircleX class="text-red-400" /> </span>
            </template>

            <template v-else>
              {{ formatLocalizedDate({ date: date.start, locale }) }}
            </template>
          </template>
          <template v-else> {{ $t(props.placeholder || 'common.selectTimeRange') }}</template>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto p-0 max-h-[350px] overflow-auto" align="start">
        <RangeCalendar v-model="date" :number-of-months="2" initial-focus :is-date-disabled="disableDates" :locale="locale" />
      </PopoverContent>
    </Popover>
  </div>
</template>
