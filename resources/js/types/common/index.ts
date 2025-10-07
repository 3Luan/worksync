import { EditLeaveRequestDetail, EditRemoteWorkDetail, EditSpecialWorkDetail } from '../model';

export interface FormDataCalendar {
  date: string;
  checkin_time: string;
  checkout_time: string;
  start_break: string;
  end_break: string;
  reason: string;
  time_card_id?: number;
  time_card_change_request_id?: number | null;
  reviewed_note?: string;
  report_note?: string;
}

export interface YearMonth {
  year: number;
  month: number; // 0 means whole year
}

export interface YearMonthDay extends YearMonth {
  day: number;
}

export interface FilterDateRange extends YearMonth {}

export interface FilterChangeRequest extends FilterDateRange {
  selectedUsers: number[];
  status: number;
}

export type LanguageOption = {
  label: string;
  value: string;
  icon: string;
};

export type LocaleMessage = Record<string, string>;

export type DateInput = string | Date;

// LeaveRequest
export type FormDataLeaveRequest = {
  selectedUsers?: Array<number>;
  details: EditLeaveRequestDetail[];
  reason: string;
};

export interface FilterLeaveRequest extends FilterDateRange {
  selectedUsers: number[];
  stateId: number;
}

export interface FilterLeaveRequest extends FilterDateRange {
  selectedUsers: number[];
  stateId: number;
}

// Special Work
export type FormDataSpecialWork = {
  selectedUsers?: Array<number>;
  details: EditSpecialWorkDetail[];
  reason: string;
};

export interface FilterSpecialWork extends FilterDateRange {
  selectedUsers: number[];
  stateId: number;
}

export interface FilterSpecialWork extends FilterDateRange {
  selectedUsers: number[];
  stateId: number;
}

//  Remote Work 
export type FormDataRemoteWork = {
  selectedUsers?: Array<number>;
  details: EditRemoteWorkDetail[];
  reason: string;
};

export interface FilterRemoteWork extends FilterDateRange {
  selectedUsers: number[];
  stateId: number;
}