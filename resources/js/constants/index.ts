import { generateMonths, generateYears } from '@/utils/generator';
import { ActionType, LocationIconType } from '@/enums';
import { h } from 'vue';
import { CircleHelp, Home, SquareCheck, TriangleAlert } from 'lucide-vue-next';
import { ConfirmActionDialog } from '@/types/model';

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
  ACTIVE: 1,
  INACTIVE: 0,
});

export const USER_STATUS_MAP = {
  [USER_STATUS.ACTIVE]: 'common.active',
  [USER_STATUS.INACTIVE]: 'common.inactive',
};

export const STATUS_OPTIONS = new Set([
  { label: 'common.active', value: USER_STATUS.ACTIVE },
  { label: 'common.inactive', value: USER_STATUS.INACTIVE },
]);

// ===== Approval Status =====
export const REQUEST_STATUS = Object.freeze({
  ALL: -1,
  PENDING: 0,
  APPROVED: 1,
  REJECTED: 2,
});

export const STATUS_LABEL_MAP = {
  [REQUEST_STATUS.PENDING]: ActionType.PENDING,
  [REQUEST_STATUS.APPROVED]: ActionType.APPROVED,
  [REQUEST_STATUS.REJECTED]: ActionType.REJECTED,
} as const;

export const STATUS_COLOR_MAP = {
  [REQUEST_STATUS.PENDING]: 'bg-orange-100 text-orange-800',
  [REQUEST_STATUS.APPROVED]: 'bg-sky-100 text-sky-800',
  [REQUEST_STATUS.REJECTED]: 'bg-red-100 text-red-800',
} as const;

export const STATUS_TEXT_MAP = {
  [REQUEST_STATUS.PENDING]: 'common.pending',
  [REQUEST_STATUS.APPROVED]: 'common.approved',
  [REQUEST_STATUS.REJECTED]: 'common.rejected',
} as const;

export const REQUEST_STATUS_OPTIONS = new Set([
  { label: 'common.all', value: REQUEST_STATUS.ALL },
  { label: STATUS_TEXT_MAP[REQUEST_STATUS.PENDING], value: REQUEST_STATUS.PENDING },
  { label: STATUS_TEXT_MAP[REQUEST_STATUS.APPROVED], value: REQUEST_STATUS.APPROVED },
  { label: STATUS_TEXT_MAP[REQUEST_STATUS.REJECTED], value: REQUEST_STATUS.REJECTED },
]);

export const STATUS_COMPENSATION_WORK_MAP = {
  [ActionType.APPROVED]: REQUEST_STATUS.APPROVED,
  [ActionType.REJECTED]: REQUEST_STATUS.REJECTED,
};

// ===== Time Card Status =====

export const TIME_CARD_STATUS = Object.freeze({
  PENDING: 0,
  EARLY: 1,
  ON_TIME: 2,
  LATE: 3,
  APPROVED_LATE: 4,
  EMPTY: 5,
});

export const TIME_CARD_STATUS_TEXT_MAP = {
  [TIME_CARD_STATUS.PENDING]: 'common.pending',
  [TIME_CARD_STATUS.EARLY]: 'common.early',
  [TIME_CARD_STATUS.ON_TIME]: 'common.onTime',
  [TIME_CARD_STATUS.LATE]: 'common.late',
  [TIME_CARD_STATUS.APPROVED_LATE]: 'common.approvedLate',
  [TIME_CARD_STATUS.EMPTY]: 'common.empty',
};

export const TIME_CARD_STATUS_COLOR_MAP = {
  [TIME_CARD_STATUS.PENDING]: 'bg-red-100 text-red-800',
  [TIME_CARD_STATUS.EARLY]: 'bg-blue-100 text-blue-800',
  [TIME_CARD_STATUS.ON_TIME]: 'bg-green-100 text-green-800',
  [TIME_CARD_STATUS.LATE]: 'bg-yellow-100 text-yellow-800',
  [TIME_CARD_STATUS.APPROVED_LATE]: 'bg-green-100 text-green-800',
  [TIME_CARD_STATUS.EMPTY]: 'bg-gray-300 text-gray-800',
} as const;

// ===== User Role =====
export const ROLE = Object.freeze({
  ADMIN: 0,
  STAFF: 1,
  LEADER: 2,
  ACCOUNTANT: 3
});

export const ROLE_STAFF = [
  ROLE.LEADER, ROLE.STAFF, ROLE.ACCOUNTANT
];

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

// ===== LocalStorage Keys =====
export const LOCAL_STORAGE_AUTH_TOKEN = 'auth_token';
export const LOCAL_STORAGE_REFRESH_TOKEN = 'refresh_token';
export const LOCAL_STORAGE_COLOR_THEME = 'color-theme';
export const LOCAL_STORAGE_TOKEN_EXPIRY = 'token_expiry';
export const LOCAL_STORAGE_USER = 'user';
export const LOCAL_STORAGE_LANG = 'lang';

// ===== Routes =====
export const API_LOGIN_PATH = 'login';

// ===== UI Constants =====
export const ICON_SIZE = 22;

// ===== TIME Constants =====
export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 3600;
export const MINUTES_IN_HOUR = 60;
export const TIME_SEGMENTS_FULL = 3; // HH:mm:ss
export const TIME_SEGMENTS_SHORT = 2; // HH:mm

export const CHECKIN_ON_TIME_HOUR = 9;
export const LATE_DAYS_WARNING_THRESHOLD = 3; // 3 days

export const DEFAULT_TIME_HHMM = '--:--'; // Default time format for HH:mm

// ===== YearSelect Constants =====
export const DEFAULT_START_YEAR = 2000;
export const DEFAULT_YEAR_RANGE = 25;

// ===== Notification Email =====
export const NOTIFICATION_EMAIL_STATUS = Object.freeze({
  ON: true,
  OFF: false,
});

export const NOTIFICATION_EMAIL_STATUS_OPTIONS = new Set([
  { label: 'common.on', value: NOTIFICATION_EMAIL_STATUS.ON },
  { label: 'common.off', value: NOTIFICATION_EMAIL_STATUS.OFF },
]);

// ===== Overview Statistics =====
export const OVERVIEW_STATISTICS_DEFAULT = {
  total_users: 0,
  checkin_users: 0,
  checkout_users: 0,
  not_checkout_users: 0,
};

export const DAY_OF_WEEK = Object.freeze({
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
});

export const DAY_OF_WEEK_COUNT = 7;
// ===== Location Icon Types =====
export const ICON_TOOLTIP_MAP = {
  [LocationIconType.InOffice]: {
    icon: h(SquareCheck, { class: 'text-green-500 w-5 h-5' }),
    titleTooltip: 'common.checkinCheckoutInOffice',
  },
  [LocationIconType.OutsideOffice]: {
    icon: h(TriangleAlert, { class: 'text-yellow-500 w-5 h-5' }),
    titleTooltip: 'common.checkinCheckoutOutsideOffice',
  },
  [LocationIconType.NoInfo]: {
    icon: h(CircleHelp, { class: 'text-red-500 w-5 h-5' }),
    titleTooltip: 'common.noLocationInfo',
  },
   [LocationIconType.RemoteWork]: {
    icon: h(Home, { class: 'text-blue-500 w-5 h-5' }),
    titleTooltip: 'common.remoteWork',
  },
} as const;

// ===== Request State =====
export const REQUEST_STATE = Object.freeze({
  ALL: -1,
  PENDING_LEADER: 1,
  LEADER_APPROVED: 2,
  LEADER_REJECTED: 3,
  ADMIN_APPROVED: 4,
  ADMIN_REJECTED: 5,
});

export const REQUEST_STATE_MAP = {
  [REQUEST_STATE.PENDING_LEADER]: 'common.pendingLeader',
  [REQUEST_STATE.LEADER_APPROVED]: 'common.leaderApproved',
  [REQUEST_STATE.LEADER_REJECTED]: 'common.leaderRejected',
  [REQUEST_STATE.ADMIN_APPROVED]: 'common.adminApproved',
  [REQUEST_STATE.ADMIN_REJECTED]: 'common.adminRejected',
};

export const REQUEST_STATE_COLOR_MAP = {
  [REQUEST_STATE.PENDING_LEADER]: 'bg-orange-100 text-orange-800',
  [REQUEST_STATE.LEADER_APPROVED]: 'bg-sky-100 text-sky-800',
  [REQUEST_STATE.LEADER_REJECTED]: 'bg-red-100 text-red-800',
  [REQUEST_STATE.ADMIN_APPROVED]: 'bg-green-100 text-green-800',
  [REQUEST_STATE.ADMIN_REJECTED]: 'bg-red-100 text-red-800',
};

export const REQUEST_STATE_OPTIONS = [
  { label: 'common.all', value: REQUEST_STATE.ALL },
  { label: REQUEST_STATE_MAP[REQUEST_STATE.PENDING_LEADER], value: REQUEST_STATE.PENDING_LEADER },
  { label: REQUEST_STATE_MAP[REQUEST_STATE.LEADER_APPROVED], value: REQUEST_STATE.LEADER_APPROVED },
  { label: REQUEST_STATE_MAP[REQUEST_STATE.LEADER_REJECTED], value: REQUEST_STATE.LEADER_REJECTED },
  { label: REQUEST_STATE_MAP[REQUEST_STATE.ADMIN_APPROVED], value: REQUEST_STATE.ADMIN_APPROVED },
  { label: REQUEST_STATE_MAP[REQUEST_STATE.ADMIN_REJECTED], value: REQUEST_STATE.ADMIN_REJECTED },
];

export const DAY_TYPE = Object.freeze({
  FULL_DAY: 1,
  HALF_DAY_MORNING: 2,
  HALF_DAY_AFTERNOON: 3,
});

export const DAY_TYPE_MAP = {
  [DAY_TYPE.FULL_DAY]: 'calendar.fullDay',
  [DAY_TYPE.HALF_DAY_MORNING]: 'calendar.halfDayMorning',
  [DAY_TYPE.HALF_DAY_AFTERNOON]: 'calendar.halfDayAfternoon',
};

export const DAY_TYPE_OPTIONS = [
  { label: DAY_TYPE_MAP[DAY_TYPE.FULL_DAY], value: DAY_TYPE.FULL_DAY },
  { label: DAY_TYPE_MAP[DAY_TYPE.HALF_DAY_MORNING], value: DAY_TYPE.HALF_DAY_MORNING },
  { label: DAY_TYPE_MAP[DAY_TYPE.HALF_DAY_AFTERNOON], value: DAY_TYPE.HALF_DAY_AFTERNOON },
];

const CONFIRM_DIALOG_REQUEST = (request: string) => {
  return {
    [ActionType.APPROVED]: {
      title: 'common.confirmApprove',
      description: `common.confirmApprove${request}Message`,
      confirmText: 'common.approve',
      type: ActionType.APPROVED,
    },
    [ActionType.REJECTED]: {
      title: 'common.confirmReject',
      description: `common.confirmReject${request}Message`,
      confirmText: 'common.reject',
      type: ActionType.REJECTED,
    },
    [ActionType.RESTORED]: {
      title: 'common.confirmRestore',
      description: `common.confirmRestore${request}Message`,
      confirmText: 'common.restore',
      type: ActionType.RESTORED,
    },
    [ActionType.DELETE]: {
      title: 'common.confirmDelete',
      description: `common.confirmDelete${request}Message`,
      confirmText: 'common.delete',
      type: ActionType.DELETE,
    },
  } as const;
};

export const COLOR_BUTTON_ACTION: Record<ConfirmActionDialog, string> = {
  [ActionType.APPROVED]: 'green',
  [ActionType.REJECTED]: 'red',
} as const;

export const STATUS_EDIT_REQUEST_DETAIL = Object.freeze({
  NEW: 1,
  DELETE: 2,
});

export const TAB_CALENDAR_REQUEST = {
  REQUESTS: 'requests',
  SCHEDULE: 'schedule',
};

// ===== Leave Request State =====
export const LEAVE_REQUEST_STATE = REQUEST_STATE;
export const LEAVE_REQUEST_STATE_MAP = REQUEST_STATE_MAP;
export const LEAVE_REQUEST_STATE_COLOR_MAP = REQUEST_STATE_COLOR_MAP;
export const LEAVE_REQUEST_STATE_OPTIONS = REQUEST_STATE_OPTIONS;
export const LEAVE_DAY_TYPE = DAY_TYPE;
export const LEAVE_DAY_TYPE_MAP = DAY_TYPE_MAP;
export const LEAVE_DAY_TYPE_OPTIONS = DAY_TYPE_OPTIONS;
export const CONFIRM_DIALOG_LEAVE_REQUEST = CONFIRM_DIALOG_REQUEST('LeaveRequest');
export const STATUS_EDIT_LEAVE_REQUEST_DETAIL = STATUS_EDIT_REQUEST_DETAIL;
export const TAB_CALENDAR_LEAVE_REQUEST = {
  ...TAB_CALENDAR_REQUEST,
  SUMMARY: 'summary',
};

// ===== Special Work Constants =====
export const SPECIAL_WORK_STATE = REQUEST_STATE;
export const SPECIAL_WORK_STATE_MAP = REQUEST_STATE_MAP;
export const SPECIAL_WORK_STATE_COLOR_MAP = REQUEST_STATE_COLOR_MAP;
export const SPECIAL_WORK_STATE_OPTIONS = REQUEST_STATE_OPTIONS;
export const SPECIAL_WORK_DAY_TYPE = DAY_TYPE;
export const SPECIAL_WORK_DAY_TYPE_MAP = DAY_TYPE_MAP;
export const SPECIAL_WORK_SHIFT_TYPE_MAP = {
  [DAY_TYPE.FULL_DAY]: 'calendar.fullDay',
  [DAY_TYPE.HALF_DAY_MORNING]: 'calendar.workAfternoon',
  [DAY_TYPE.HALF_DAY_AFTERNOON]: 'calendar.workMorning',
} as const;
export const REMOTE_WORK_SHIFT_TYPE_MAP = {
  [DAY_TYPE.FULL_DAY]: 'calendar.fullDay',
  [DAY_TYPE.HALF_DAY_MORNING]: 'calendar.workAfternoon',
  [DAY_TYPE.HALF_DAY_AFTERNOON]: 'calendar.workMorning',
} as const;

// ===== Remote Work Constants =====
export const REMOTE_WORK_STATE = REQUEST_STATE;
export const REMOTE_WORK_STATE_MAP = REQUEST_STATE_MAP;
export const REMOTE_WORK_STATE_COLOR_MAP = REQUEST_STATE_COLOR_MAP;
export const REMOTE_WORK_STATE_OPTIONS = REQUEST_STATE_OPTIONS;
export const REMOTE_WORK_DAY_TYPE = DAY_TYPE;
export const REMOTE_WORK_DAY_TYPE_MAP = DAY_TYPE_MAP;
export const REMOTE_WORK_DAY_TYPE_OPTIONS = DAY_TYPE_OPTIONS;
export const CONFIRM_DIALOG_REMOTE_WORK = CONFIRM_DIALOG_REQUEST('RemoteWork');
export const STATUS_EDIT_REMOTE_WORK_DETAIL = STATUS_EDIT_REQUEST_DETAIL;
export const TAB_CALENDAR_REMOTE_WORK = TAB_CALENDAR_REQUEST;
export const TAB_CALENDAR_SPECIAL_REMOTE_WORK = TAB_CALENDAR_REQUEST;


export const SPECIAL_WORK_DAY_TYPE_OPTIONS = DAY_TYPE_OPTIONS;
export const CONFIRM_DIALOG_SPECIAL_WORK = CONFIRM_DIALOG_REQUEST('SpecialWork');
export const STATUS_EDIT_SPECIAL_WORK_DETAIL = STATUS_EDIT_REQUEST_DETAIL;
export const TAB_CALENDAR_SPECIAL_WORK = TAB_CALENDAR_REQUEST;

// ===== Location Constants =====
export const LOCATION_RETRY_DELAY = 10000; // 10 second
export const MAX_LOCATION_RETRY = 3;
export const LOCATION_MAX_AGE = 0; // Always fetch fresh location, no cache

export const STATUS_EDIT_COMPENSATION_WORK_REQUEST_DETAIL = STATUS_EDIT_REQUEST_DETAIL

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

export const FIRST_DAY_OF_YEAR = {
  day: 1,
  month: 1,
};
export const LAST_DAY_OF_YEAR = {
  day: 31,
  month: 12,
};

export const MAX_DISPLAY_NAME = 2; // Maximum number of names to display in the calendar

export const MAX_DISPLAY_BADGE = 99; // Maximum number of badges to display in the sidebar

export const TOTAL_MONTHS_IN_YEAR = 12;

export const HIGHLIGHT_CLASSES = {
  danger: 'bg-red-100 dark:bg-red-950',
  info: 'bg-blue-200 dark:bg-blue-800',
} as const;

export const CUT_OFF_HOUR_7PM = 19;
export const DAY_TYPE_OPTIONS_LEAVE = [
  { label: DAY_TYPE_MAP[DAY_TYPE.FULL_DAY], value: DAY_TYPE.FULL_DAY },
  { label: DAY_TYPE_MAP[DAY_TYPE.HALF_DAY_MORNING], value: DAY_TYPE.HALF_DAY_MORNING },
  { label: DAY_TYPE_MAP[DAY_TYPE.HALF_DAY_AFTERNOON], value: DAY_TYPE.HALF_DAY_AFTERNOON },
];

export const DAY_TYPE_OPTIONS_SPECIAL_WORK = [
  { label: SPECIAL_WORK_SHIFT_TYPE_MAP[DAY_TYPE.FULL_DAY], value: DAY_TYPE.FULL_DAY },
  { label: SPECIAL_WORK_SHIFT_TYPE_MAP[DAY_TYPE.HALF_DAY_MORNING], value: DAY_TYPE.HALF_DAY_MORNING },
  { label: SPECIAL_WORK_SHIFT_TYPE_MAP[DAY_TYPE.HALF_DAY_AFTERNOON], value: DAY_TYPE.HALF_DAY_AFTERNOON },
];

export const DAY_TYPE_OPTIONS_REMOTE_WORK = [
  { label: REMOTE_WORK_SHIFT_TYPE_MAP[DAY_TYPE.FULL_DAY], value: DAY_TYPE.FULL_DAY },
  { label: REMOTE_WORK_SHIFT_TYPE_MAP[DAY_TYPE.HALF_DAY_MORNING], value: DAY_TYPE.HALF_DAY_MORNING },
  { label: REMOTE_WORK_SHIFT_TYPE_MAP[DAY_TYPE.HALF_DAY_AFTERNOON], value: DAY_TYPE.HALF_DAY_AFTERNOON },
];

export const REQUEST_TYPE = {
  LEAVE_REQUEST: 'LEAVE_REQUEST',
  SPECIAL_WORK: 'SPECIAL_WORK',
  REMOTE_WORK: 'REMOTE_WORK',
} as const;

