import { ColumnDef } from '@tanstack/vue-table';

export interface ActionTable {
  icon: any;
  title: string;
  key: string;
}

export interface ConfigTable {
  columns: ColumnDef<any>[];
  generateActions: Function;
  rowClassName?: (row: any) => string;
}
