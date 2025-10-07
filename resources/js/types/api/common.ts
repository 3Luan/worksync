import { SortDirectionType } from '@/enums';
import { EditCompensationWorkRequestDetail } from '../model';

export interface PaginationParams {
  year?: number;
  page?: number;
  per_page?: number;
  get_all?: boolean;
}

export interface FromDateToDateParams {
  from_date: string;
  to_date: string;
}

// Define a common interface for BaseResponse schema
export interface BaseResponseType {
  success: boolean;
  message: string;
  status: number;
  errors: any | null;
  data: unknown | null;
}

// Define the response type for a successful API call
export interface SuccessResponse<T = null> extends BaseResponseType {
  success: true;
  data: T; // Use generic to allow different types of success data
  errors: null;
}

// Define the response type for an error API call
export interface ErrorResponse extends BaseResponseType {
  success: false;
  data: null;
  errors: Record<string, string[]>; // Specific error structure
}

// Union type for both success and error responses
export type ApiResponse<T = null> = SuccessResponse<T> | ErrorResponse;

export interface ActionResultData {
  headers: Record<string, any>;
  original: {
    message: string;
  };
  exception: null;
}

export interface SortingType {
  sortBy?: string;
  sortDirection?: SortDirectionType;
}

export interface NotificationEmailPayload {
  email: string;
  is_active: boolean;
  receive_all: boolean;
  events?: { id: number; is_active: boolean }[];
}

export interface CompensationWorkRequestPayload {
  user_ids?: number[];
  reason?: string;
  feedback?: string;
  details?: EditCompensationWorkRequestDetail[];
  missing_date?: string;
}

export interface GetCompensationWorkRequestParams extends PaginationParams {
  user_ids?: number[];
  name?: string;
  status?: number;
  from_date?: string;
  to_date?: string;
}

export interface ReviewCompensationWorkRequestPayload {
  status: number;
  reviewedNote?: string;
}

export interface GetCompensationWorkRequestByDateParams {
  date: string;
  user_id?: number;
}
