import { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { FilePenLine, RotateCcw, Trash2 } from 'lucide-vue-next';
import type { ActionTable, ConfigTable } from '@/types/component';
import type { User } from '@/types/model';
import { sortableHeader } from '@/lib/utils';
import { USER_ROLE_MAP, USER_STATUS_MAP } from '@/constants/index';
import { useAuthStore } from '@/stores/authStore';
import { $t } from '@/utils/i18n';
import { ActionType } from '@/enums';

const store = useAuthStore();

const userTableConfig = (): ColumnDef<User>[] => {
  return [
    {
      accessorKey: 'name',
      header: () => h('div', { class: 'text-left' }, $t('common.fullName')),
      cell: ({ row }) => {
        return h('div', { class: 'text-left font-medium' }, row.original.name);
      },
    },
    {
      accessorKey: 'email',
      header: () => h('div', { class: 'text-left' }, $t('auth.email')),
      cell: ({ row }) => {
        const email: string = row.getValue('email');
        return h('div', { class: 'text-left font-medium' }, email);
      },
    },
    {
      accessorKey: 'role',
      header: ({ column }) => {
        return sortableHeader($t('common.role'), column);
      },
      cell: ({ row }) => {
        const role: number = Number(row.getValue('role'));
        const roleLabel = USER_ROLE_MAP[role as keyof typeof USER_ROLE_MAP] || role;
        return h('div', { class: 'text-left font-medium' }, $t(`${roleLabel}`));
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => sortableHeader($t('common.status'), column),
      cell: ({ row }) => {
        const status: number = Number(row.getValue('status'));
        const statusLabel = USER_STATUS_MAP[status as keyof typeof USER_STATUS_MAP] || status;
        return h('div', { class: `text-left font-medium` }, $t(`${statusLabel}`));
      },
    },
  ];
};

const generateActions = (data: User) => {
  let actions: ActionTable[] = [];
  if (data.deleted_at !== null) {
    actions.push({
      title: $t('common.restore'),
      icon: RotateCcw,
      key: ActionType.RESTORED,
    });
  } else {
    actions.push({
      title: $t('common.edit'),
      icon: FilePenLine,
      key: ActionType.EDIT,
    });
    if (store.currentUser()?.id !== data.id) {
      actions.push({
        title: $t('common.delete'),
        icon: h(Trash2, { color: 'red' }),
        key: ActionType.DELETE,
      });
    }
  }

  if (store.isAccountant) {
    return (actions = []);
  } else {
    return actions;
  }
};

const rowClassName = (row: User) => {
  return row.deleted_at ? 'bg-red-100 text-red-500' : '';
};

export const dataTableConfig: ConfigTable = {
  get columns() {
    return userTableConfig();
  },
  generateActions,
  rowClassName,
};
