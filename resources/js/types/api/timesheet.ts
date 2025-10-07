import type { PaginationParams, FromDateToDateParams, SortingType } from './common';
import { REQUEST_STATUS } from '@/constants';

export interface GetCalendarsParams extends PaginationParams, FromDateToDateParams, SortingType {}

export interface GetCalendarChangeRequestParams extends PaginationParams {
  user_ids?: number[];
  name?: string;
  status?: number;
  from_date?: string;
  to_date?: string;
}

export interface UpdateStatusRequestData {
  status: string;
  reviewed_note?: string;
}

export interface WorkingDayParams extends PaginationParams, FromDateToDateParams, SortingType {}

export interface ExportFileParams extends FromDateToDateParams {}

export interface ExportZipFileParams {
  from_date: string;
  to_date: string;
  user_ids?: number[];
  get_all?: boolean;
  display_timezone?: string | null;
}

export interface SearchConditionsParams extends FromDateToDateParams {
  status: (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];
}

export interface TimeCardPayload extends CheckinPayload {
  date?: string;
  checkin_time?: string;
  checkout_time?: string;
  start_break_time?: string;
  end_break_time?: string;
  report_note?: string;
  reason?: string;
  time_card_id?: number;
  late_reason?: string | null;
}

export interface CheckinPayload {
  longitude?: number | null;
  latitude?: number | null;
}

export interface CheckoutPayload {
  report_note?: string;
  longitude: number | null;
  latitude: number | null;
}

export interface TimeCardResponse {
  id?: number;
  user_id?: number;
  date?: string;
  checkin_time: string | null;
  checkout_time: string | null;
  break_start: string | null;
  break_end: string | null;
  report_note?: string | null;
  reviewed_note?: string | null;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

export interface HolidayRequest {
  date: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface GetHolidaysParams extends PaginationParams, SortingType {
  year?: number;
  get_all?: boolean;
}

export interface HolidayFormValues {
  date: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface DateParams {
  date: Date;
}

export interface RefreshTokenData {
  refresh_token: string;
}

export interface PendingRequestsCountResponse {
  pending_leaves: number;
  pending_changes: number;
  pending_special_works: number;
  pending_special_remote_works: number;
  pending_compensation_work: number;
}

export interface SendReminderEmailPayload {
  user_ids: number[];
}
