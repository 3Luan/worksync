import { ActionType } from '@/enums';

export type ConfirmActionDialog = typeof ActionType.APPROVED | typeof ActionType.REJECTED;
export type ViewOrUpdateActionDialog = typeof ActionType.VIEW | typeof ActionType.UPDATE;
export type ActionDialogLeaveRequest =
  | ConfirmActionDialog
  | typeof ActionType.RESTORED
  | typeof ActionType.VIEW
  | typeof ActionType.UPDATE;
export type ConfirmOrRestoreActionDialog = ConfirmActionDialog | typeof ActionType.RESTORED;
export type ConfirmOrViewActionDialog = ConfirmActionDialog | typeof ActionType.VIEW;
export type ActionDialogChangeRequest = ConfirmOrViewActionDialog | typeof ActionType.PROCESSED;
export type ActionDialogSpecialWork =
  | ConfirmActionDialog
  | typeof ActionType.RESTORED
  | typeof ActionType.VIEW
  | typeof ActionType.UPDATE;
export type ActionDialogRemoteWork =
  | ConfirmActionDialog
  | typeof ActionType.RESTORED
  | typeof ActionType.VIEW
  | typeof ActionType.UPDATE;
