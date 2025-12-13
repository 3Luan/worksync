import { SortDirectionType } from '@/enums';
import { SortingType } from '@/types/api';
import { Updater } from '@tanstack/vue-table';
import { type ClassValue, clsx } from 'clsx';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-vue-next';
import { twMerge } from 'tailwind-merge';
import { h, Ref } from 'vue';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue;
}

/**
 * render header sortable
 * @param title
 * @param column
 * @param sortedType
 * @param customClass
 * @returns
 */
export function sortableHeader(
  title: string,
  column: any,
  sortedType?: SortDirectionType | null,
  customClass = '',
) {
  let Icon = ArrowUpDown;

  const type = sortedType || column.getIsSorted();

  if (type === SortDirectionType.Asc) {
    Icon = ArrowUp;
  } else if (type === SortDirectionType.Desc) {
    Icon = ArrowDown;
  }

  return h(
    'div',
    {
      class: cn('flex items-center cursor-pointer', customClass),
      onClick: () => column.toggleSorting(column.getIsSorted() === SortDirectionType.Asc),
    },
    [title, h(Icon, { class: 'ml-2 h-4 w-4' })],
  );
}

export const sortingValueTable = (
  isSorted: false | SortDirectionType,
  headerId: string,
): SortingType | null => {
  if (isSorted) {
    return {
      sortBy: headerId,
      sortDirection: isSorted,
    };
  }
  return null;
};
