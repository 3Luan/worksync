import type { PaginationParams, SortingType } from './common';

export interface GetUsersParams extends PaginationParams, SortingType {
  name?: string;
  is_delete?: boolean;
  is_checking_today?: boolean;
}

export interface UserCheckinStatisticsParams extends PaginationParams {
  date?: string;
}

export interface getActiveStaffUsersParams extends PaginationParams {
  roles: number[];
}
