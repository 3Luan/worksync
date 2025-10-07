<script lang="ts" setup>
import { cn } from '@/lib/utils';
import { RangeCalendarRoot, type RangeCalendarRootEmits, type RangeCalendarRootProps, useForwardPropsEmits } from 'reka-ui';
import { type HTMLAttributes, ref } from 'vue';
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarNextButton,
  RangeCalendarPrevButton,
} from '.';
import { type DateValue } from '@internationalized/date';

const props = defineProps<RangeCalendarRootProps & { class?: HTMLAttributes['class'] }>();

const emits = defineEmits<
  RangeCalendarRootEmits & {
    'year-change': [year: number];
    'month-change': [month: number, year: number];
  }
>();

const forwarded = useForwardPropsEmits(props, emits);

const currentYear = ref<number>(new Date().getFullYear());

const handleNextPage = (placeholder: DateValue): DateValue => {
  const next = placeholder.add({ months: 1 });

  if (currentYear.value !== next.year) {
    currentYear.value = next.year;
    emits('year-change', next.year);
  }

  emits('month-change', next.month, next.year);
  return next;
};

const handlePrevPage = (placeholder: DateValue): DateValue => {
  const prev = placeholder.subtract({ months: 1 });

  if (currentYear.value !== prev.year) {
    currentYear.value = prev.year;
    emits('year-change', prev.year);
  }

  emits('month-change', prev.month, prev.year);
  return prev;
};
</script>

<template>
  <RangeCalendarRoot
    v-slot="{ grid, weekDays }"
    data-slot="range-calendar"
    :class="cn('p-3', props.class)"
    v-bind="{
      ...forwarded,
      nextPage: handleNextPage,
      prevPage: handlePrevPage,
    }"
  >
    <RangeCalendarHeader>
      <RangeCalendarHeading />

      <div class="flex items-center gap-1">
        <RangeCalendarPrevButton />
        <RangeCalendarNextButton />
      </div>
    </RangeCalendarHeader>

    <div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
      <RangeCalendarGrid v-for="month in grid" :key="month.value.toString()">
        <RangeCalendarGridHead>
          <RangeCalendarGridRow>
            <RangeCalendarHeadCell v-for="day in weekDays" :key="day">
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="mt-2 w-full">
            <RangeCalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate">
              <RangeCalendarCellTrigger :day="weekDate" :month="month.value" />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </div>
  </RangeCalendarRoot>
</template>
