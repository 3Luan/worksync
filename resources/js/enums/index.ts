export enum HttpStatusCode {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  UNPROCESSABLE_ENTITY = 422,
  SERVER_ERROR = 500,
}

export enum TimeBlockType {
  CHECKIN = 'checkin',
  CHECKOUT = 'checkout',
  BREAK_START = 'break-start',
  BREAK_END = 'break-end',
}

export enum LocationIconType {
  InOffice = 'in_office',
  OutsideOffice = 'outside_office',
  NoInfo = 'no_info',
  RemoteWork = 'remote_work',
}

export enum ModalActionType {
  Checkin = 'checkin',
  Checkout = 'checkout',
}

export enum AlignType {
  Start = 'start',
  Center = 'center',
  End = 'end',
}

export enum SideType {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export enum SortDirectionType {
  Asc = 'asc',
  Desc = 'desc',
}

export enum ColorTheme {
  Light = 'light',
  Dark = 'dark',
}

export enum WeekdayFormat {
  Long = 'long',
  Short = 'short',
  Narrow = 'narrow',
}

export enum DateFormatStyle {
  Full = 'full',
  Long = 'long',
  Medium = 'medium',
  Short = 'short',
}

export enum ActionType {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSED = 'processed',
  VIEW = 'view',
  RESTORED = 'restored',
  DELETE = 'delete',
  EDIT = 'edit',
  UPDATE = 'update',
  WARNING = 'warning',
  PENDING = 'pending',
  INFO = 'info',
  TOGGLE = 'toggle',
  EDIT_REPORT = 'edit_report',
  OTHER = 'other',
}

export enum Language {
  vi = 'vi',
  en = 'en',
  ja = 'ja',
}
