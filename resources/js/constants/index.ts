import { generateMonths, generateYears } from '@/utils/generator';

// ===== Time Options =====
export const MONTH_OPTIONS = generateMonths();
export const YEAR_OPTIONS = generateYears();
export const TIME_LIMIT_DEFAULT = 10;
export const PAGINATION_INFO_DEFAULT = {
  page: 1,
  pageLength: 10,
  total: 0,
  perPage: 50,
};

// ===== User Status =====
export const USER_STATUS = Object.freeze({
  INACTIVE: 0,
  ACTIVE: 1,
});

export const USER_PRESENCE = Object.freeze({
  OFFLINE: 0,
  ONLINE: 1,
});

export const USER_STATUS_MAP = {
  [USER_STATUS.ACTIVE]: 'common.active',
  [USER_STATUS.INACTIVE]: 'common.inactive',
};

export const STATUS_OPTIONS = new Set([
  { label: 'common.active', value: USER_STATUS.ACTIVE },
  { label: 'common.inactive', value: USER_STATUS.INACTIVE },
]);

// ===== User Role =====
export const ROLE = Object.freeze({
  ADMIN: 0,
  STAFF: 1,
  LEADER: 2,
  ACCOUNTANT: 3,
});

export const ROLE_STAFF = [ROLE.LEADER, ROLE.STAFF, ROLE.ACCOUNTANT];

export const USER_ROLE_MAP = {
  [ROLE.ADMIN]: 'common.admin',
  [ROLE.LEADER]: 'common.leader',
  [ROLE.STAFF]: 'common.employee',
  [ROLE.ACCOUNTANT]: 'common.accountant',
};

export const ROLE_OPTIONS = new Set([
  { label: 'common.employee', value: ROLE.STAFF },
  { label: 'common.leader', value: ROLE.LEADER },
  { label: 'common.admin', value: ROLE.ADMIN },
  { label: 'common.accountant', value: ROLE.ACCOUNTANT },
]);

// ===== Conversation Types =====
export const CONVERSATION_TYPE = Object.freeze({
  DIRECT: 0,
  GROUP: 1,
  CHANNEL: 2,
});

export const CONVERSATION_TYPE_MAP = {
  [CONVERSATION_TYPE.DIRECT]: 'common.direct',
  [CONVERSATION_TYPE.GROUP]: 'common.group',
  [CONVERSATION_TYPE.CHANNEL]: 'common.channel',
};

export const CONVERSATION_TYPE_OPTIONS = new Set([
  { label: 'common.direct', value: CONVERSATION_TYPE.DIRECT },
  { label: 'common.group', value: CONVERSATION_TYPE.GROUP },
  { label: 'common.channel', value: CONVERSATION_TYPE.CHANNEL },
]);

// ===== Conversation Member Roles =====
export const CONVERSATION_MEMBER_ROLE = Object.freeze({
  ADMIN: 'admin',
  MEMBER: 'member',
});

export const CONVERSATION_MEMBER_ROLE_MAP = {
  [CONVERSATION_MEMBER_ROLE.ADMIN]: 'common.admin',
  [CONVERSATION_MEMBER_ROLE.MEMBER]: 'common.member',
};

export const CONVERSATION_MEMBER_ROLE_OPTIONS = new Set([
  { label: 'common.admin', value: CONVERSATION_MEMBER_ROLE.ADMIN },
  { label: 'common.member', value: CONVERSATION_MEMBER_ROLE.MEMBER },
]);

// ===== Message Log =====
export const MESSAGE_LOG_ACTION = Object.freeze({
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  RESTORE: 'restore',
  REACT: 'react',
});

export const MESSAGE_LOG_ACTION_MAP = {
  [MESSAGE_LOG_ACTION.CREATE]: 'messageLog.createdMessage',
  [MESSAGE_LOG_ACTION.EDIT]: 'messageLog.editedMessage',
  [MESSAGE_LOG_ACTION.DELETE]: 'messageLog.deletedMessage',
  [MESSAGE_LOG_ACTION.RESTORE]: 'messageLog.restoredMessage',
  [MESSAGE_LOG_ACTION.REACT]: 'messageLog.reactedMessage',
};

export const MESSAGE_LOG_ACTION_OPTIONS = new Set([
  { label: 'messageLog.createdMessage', value: MESSAGE_LOG_ACTION.CREATE },
  { label: 'messageLog.editedMessage', value: MESSAGE_LOG_ACTION.EDIT },
  { label: 'messageLog.deletedMessage', value: MESSAGE_LOG_ACTION.DELETE },
  { label: 'messageLog.restoredMessage', value: MESSAGE_LOG_ACTION.RESTORE },
  { label: 'messageLog.reactedMessage', value: MESSAGE_LOG_ACTION.REACT },
]);

// ===== Device Types =====
export const DEVICE_TYPE = Object.freeze({
  WEB: 'web',
  ANDROID: 'android',
  IOS: 'ios',
});

export const DEVICE_TYPE_MAP = {
  [DEVICE_TYPE.WEB]: 'common.web',
  [DEVICE_TYPE.ANDROID]: 'common.android',
  [DEVICE_TYPE.IOS]: 'common.ios',
};

export const DEVICE_TYPE_OPTIONS = new Set([
  { label: 'common.web', value: DEVICE_TYPE.WEB },
  { label: 'common.android', value: DEVICE_TYPE.ANDROID },
  { label: 'common.ios', value: DEVICE_TYPE.IOS },
]);

// ===== Message Types =====
export const MESSAGE_TYPE = Object.freeze({
  TEXT: 0,
  IMAGE: 1,
  FILE: 2,
  VIDEO: 3,
  AUDIO: 4,
  SYSTEM: 5,
});

export const MESSAGE_TYPE_MAP = {
  [MESSAGE_TYPE.TEXT]: 'common.text',
  [MESSAGE_TYPE.IMAGE]: 'common.image',
  [MESSAGE_TYPE.FILE]: 'common.file',
  [MESSAGE_TYPE.VIDEO]: 'common.video',
  [MESSAGE_TYPE.AUDIO]: 'common.audio',
  [MESSAGE_TYPE.SYSTEM]: 'common.system',
};

export const MESSAGE_TYPE_OPTIONS = new Set([
  { label: 'common.text', value: MESSAGE_TYPE.TEXT },
  { label: 'common.image', value: MESSAGE_TYPE.IMAGE },
  { label: 'common.file', value: MESSAGE_TYPE.FILE },
  { label: 'common.video', value: MESSAGE_TYPE.VIDEO },
  { label: 'common.audio', value: MESSAGE_TYPE.AUDIO },
  { label: 'common.system', value: MESSAGE_TYPE.SYSTEM },
]);

// ===== Message Status =====
export const MESSAGE_STATUS = Object.freeze({
  SENDING: 0,
  SENT: 1,
  DELIVERED: 2,
  SEEN: 3,
  FAILED: 4,
});

export const MESSAGE_STATUS_MAP = {
  [MESSAGE_STATUS.SENDING]: 'common.sending',
  [MESSAGE_STATUS.SENT]: 'common.sent',
  [MESSAGE_STATUS.DELIVERED]: 'common.delivered',
  [MESSAGE_STATUS.SEEN]: 'common.seen',
  [MESSAGE_STATUS.FAILED]: 'common.failed',
};

export const MESSAGE_STATUS_OPTIONS = new Set([
  { label: 'common.sending', value: MESSAGE_STATUS.SENDING },
  { label: 'common.sent', value: MESSAGE_STATUS.SENT },
  { label: 'common.delivered', value: MESSAGE_STATUS.DELIVERED },
  { label: 'common.seen', value: MESSAGE_STATUS.SEEN },
  { label: 'common.failed', value: MESSAGE_STATUS.FAILED },
]);

// ===== LocalStorage Keys =====
export const LOCAL_STORAGE_AUTH_TOKEN = 'auth_token';
export const LOCAL_STORAGE_REFRESH_TOKEN = 'refresh_token';
export const LOCAL_STORAGE_COLOR_THEME = 'color-theme';
export const LOCAL_STORAGE_TOKEN_EXPIRY = 'token_expiry';
export const LOCAL_STORAGE_USER = 'user';
export const LOCAL_STORAGE_LANG = 'lang';

// ===== Routes =====
export const API_LOGIN_PATH = 'login';

// ===== TIME Constants =====
export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 3600;
export const MINUTES_IN_HOUR = 60;
export const TIME_SEGMENTS_FULL = 3; // HH:mm:ss
export const TIME_SEGMENTS_SHORT = 2; // HH:mm

export const DEFAULT_TIME_HHMM = '--:--'; // Default time format for HH:mm

// ===== YearSelect Constants =====
export const DEFAULT_START_YEAR = 2000;
export const DEFAULT_YEAR_RANGE = 25;

export const DAY_OF_WEEK = Object.freeze({
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
});

export const DATE_FORMATS = {
  DATE: 'dd-MM-yyyy', // 29-11-2025
  DATE_ISO: 'yyyy-MM-dd', // 2025-11-29
  DATE_SLASH: 'dd/MM/yyyy', // 29/11/2025
  MONTH: 'MM-yyyy', // 11-2025
  MONTH_SLASH: 'MM/yyyy', // 11/2025
  MONTH_DAY: 'MMdd', // 1129
  SHORT_DATETIME_SLASH: 'dd/MM/yyyy HH:mm', // 29/11/2025 14:30
  FULL_TIME: 'HH:mm:ss', // 14:30:00
  TIME: 'HH:mm', // 14:30
} as const;

export const MAX_DISPLAY_BADGE = 99; // Maximum number of badges to display in the sidebar
