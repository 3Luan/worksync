<script setup lang="ts" generic="TData">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  PaginationTable,
  DataTableDropDown,
} from '@/components/ui/table';
import { FlexRender, getCoreRowModel, SortingState, useVueTable } from '@tanstack/vue-table';
import Combobox from '../combobox/Combobox.vue';
import { nextTick, ref, watch, computed } from 'vue';
import type { ConfigTable, PaginationType } from '@/types/component';
import { sortingValueTable, valueUpdater } from '@/lib/utils';
import { LoaderCircle } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { SortDirectionType } from '@/enums';
import { FileSpreadsheet } from 'lucide-vue-next';

const { t: $t } = useI18n();
const props = defineProps<{
  config: ConfigTable;
  data: TData[];
  pagination?: PaginationType;
  isLoading?: boolean;
  customClass?: string;
}>();

const paginationValue = ref<PaginationType | undefined>(props.pagination);

const emits = defineEmits(['getData', 'onAction', 'onSelectedRows', 'onSelectedAllRows']);

const pageLengthOptions = [
  { value: 10, label: 10 },
  { value: 25, label: 25 },
  { value: 50, label: 50 },
  { value: 100, label: 100 },
];

const sorting = ref<SortingState>([]);
const isForceSelectAll = ref(false);
const tableData = ref<TData[]>([]);

const table = useVueTable({
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  getCoreRowModel: getCoreRowModel(),

  get data() {
    return tableData.value;
  },
  get columns() {
    return props.config.columns;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
  },
});

watch(
  () => props.data,
  (newVal) => {
    tableData.value = [...newVal];
  },
  { immediate: true, deep: true },
);

watch(
  () => paginationValue.value?.page,
  () => {
    isForceSelectAll.value = table.getIsAllPageRowsSelected();
    emits('getData');
  },
);

watch(
  () => paginationValue.value?.perPage,
  () => {
    paginationValue.value!.page = 1;
    isForceSelectAll.value = table.getIsAllPageRowsSelected();
    emits('getData');
  },
);

watch(
  () => props.data,
  () => {
    if (isForceSelectAll.value) {
      nextTick(() => {
        table.toggleAllPageRowsSelected(true);
      });
    }
  },
  { immediate: false, deep: true },
);

watch(
  () => table.getSelectedRowModel().rows,
  (newSelectedRows) => {
    emits(
      'onSelectedRows',
      newSelectedRows.map((row) => row.original),
    );
  },
  { deep: true },
);

watch(
  () => table.getIsAllPageRowsSelected(),
  (newData) => {
    emits('onSelectedAllRows', newData);
  },
  { deep: true },
);

const handleAction = (event: Event) => {
  const target = event.target as HTMLElement;
  const button = target.closest('button');

  if (button) {
    const action = button.getAttribute('data-action');
    const id = button.getAttribute('data-id');

    if (action && id) {
      const row = props.data.find((item: any) => item.id.toString() === id);

      if (row) {
        emits('onAction', { value: row, key: action });
      }
    }
  }
};

const onAction = ({ value, key }: { value: any; key: string }) => {
  emits('onAction', { value, key });
};

const paginationText = computed(() => {
  if (!paginationValue.value || paginationValue.value.total <= 0) return '';
  const start = (paginationValue.value.page - 1) * paginationValue.value.perPage + 1;
  const end = Math.min(
    paginationValue.value.page * paginationValue.value.perPage,
    paginationValue.value.total,
  );
  const total = paginationValue.value.total;

  return $t('common.paginationInfo', { start, end, total });
});
</script>

<template>
  <div :class="['p-2 rounded-md sm:p-5', customClass]">
    <Table class="border-b mb-2" @click="handleAction">
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          class="hover:bg-transparent dark:hover:bg-transparent text-base"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="transition-colors duration-300"
            @click="
              () => {
                const isSorted = header.column.getIsSorted();
                const sortingData = sortingValueTable(
                  isSorted as false | SortDirectionType,
                  header.id,
                );
                if (sortingData) {
                  emits('getData', sortingData);
                }
              }
            "
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="props.isLoading">
          <TableRow>
            <TableCell :colspan="config.columns.length">
              <div class="h-24 flex justify-center items-center">
                <LoaderCircle class="w-6 h-6 animate-spin text-gray-600" />
              </div>
            </TableCell>
          </TableRow>
        </template>
        <template v-else-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
            :class="config.rowClassName?.(row.original)"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
                class="transition-colors duration-300"
              />
            </TableCell>
            <TableCell>
              <DataTableDropDown
                @actions="onAction"
                :value="row.original"
                :actions="config.generateActions(row.original)"
                v-if="config.generateActions(row.original).length != 0"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell
              :colspan="config.columns.length"
              class="h-24 text-center text-primary transition-colors duration-300 p-8"
            >
              <FileSpreadsheet class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-primary">{{ $t('common.noData') }}</h3>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
    <div
      v-if="table.getRowModel().rows?.length && paginationValue"
      class="flex flex-col sm:flex-row justify-between items-center w-full gap-3 sm:gap-5 mt-1"
    >
      <div class="text-sm text-muted-foreground w-full sm:w-auto text-center">
        {{ paginationText }}
      </div>
      <div class="flex flex-row justify-center sm:justify-end w-full sm:w-auto gap-3 sm:gap-5">
        <PaginationTable :model-value="paginationValue" />
        <Combobox
          :options="pageLengthOptions"
          v-model="paginationValue.perPage"
          :is-search="false"
          class="h-8 w-16 custom-open-ring dark:border-gray-300"
        />
      </div>
    </div>
  </div>
</template>
