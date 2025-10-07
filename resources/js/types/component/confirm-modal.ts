import { ActionType } from '@/enums';

export type ConfirmModalType =
  | ActionType.DELETE
  | ActionType.UPDATE
  | ActionType.RESTORED
  | ActionType.WARNING
  | ActionType.INFO
  | ActionType.APPROVED
  | ActionType.REJECTED;

export type ConfirmModalSize = 'sm' | 'md' | 'lg';

export interface ConfirmModalProps {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type: ConfirmModalType;
  size?: ConfirmModalSize;
}
