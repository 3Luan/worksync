import { Ref, computed } from 'vue';
import { FilterDateRange } from '@/types/common';

export function useDateRange(filters: Ref<FilterDateRange>) {
  const fromDate = computed(() => {
    if (filters.value.month === 0) {
      return `${filters.value.year}-01-01`;
    }
    const paddedMonth = String(filters.value.month).padStart(2, '0');
    return `${filters.value.year}-${paddedMonth}-01`;
  });

  const toDate = computed(() => {
    if (filters.value.month === 0) {
      return `${filters.value.year}-12-31`;
    }
    const lastDay = new Date(filters.value.year, filters.value.month, 0).getDate();
    const paddedMonth = String(filters.value.month).padStart(2, '0');
    const paddedDay = String(lastDay).padStart(2, '0');
    return `${filters.value.year}-${paddedMonth}-${paddedDay}`;
  });

  return { fromDate, toDate };
}
