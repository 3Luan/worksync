import type { LeaveRequestStateCode, EditLeaveRequestDetail, SpecialWorkStateCode, EditSpecialWorkDetail, EditRemoteWorkDetail, RemoteWorkStateCode } from '../model';
import type { PaginationParams, FromDateToDateParams } from './common';

interface RequestPayload {
  user_ids?: number[];
  reason?: string;
  feedback?: string;
}

interface StateRequest {
  state_id: number;
  feedback?: string;
}

interface GetRequestByYearParams {
  year?: number;
}

// Leave Request
export interface LeaveRequestPayload extends RequestPayload {
  details?: EditLeaveRequestDetail[];
}

export interface StateLeaveRequest extends StateRequest {}

export interface GetLeaveRequestParams extends PaginationParams, FromDateToDateParams {
  state_id?: LeaveRequestStateCode;
  user_ids?: number[];
  get_all?: boolean;
}

export interface GetLeaveRequestWithDetailsParams extends GetLeaveRequestParams {
  state_id?: LeaveRequestStateCode;
}

export interface GetLeaveRequestByYearParams extends GetRequestByYearParams {}

// Special Work Request
export interface SpecialWorkPayload extends RequestPayload {
  details?: EditSpecialWorkDetail[];
}

export interface StateSpecialWork extends StateRequest {}

export interface GetSpecialWorkParams extends PaginationParams, FromDateToDateParams {
  state_id?: SpecialWorkStateCode;
  user_ids?: number[];
  get_all?: boolean;
}

export interface GetSpecialWorkWithDetailsParams extends GetSpecialWorkParams {
  state_id?: SpecialWorkStateCode;
}

export interface GetSpecialWorkByYearParams extends GetRequestByYearParams {}

// Remote Work Request
export interface RemoteWorkPayload extends RequestPayload {
  details?: EditRemoteWorkDetail[];
}

export interface StateRemoteWorkRequest extends StateRequest {}

export interface GetRemoteWorkRequestParams extends PaginationParams, FromDateToDateParams {
  state_id?: RemoteWorkStateCode;
  user_ids?: number[];
  get_all?: boolean;
}

export interface GetRemoteWorkRequestByYearParams extends GetRequestByYearParams {}
