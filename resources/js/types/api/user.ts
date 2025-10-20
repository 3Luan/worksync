import type { PaginationParams, SortingType } from './common';

export interface GetUsersParams extends PaginationParams, SortingType {}

export interface UserCheckinStatisticsParams extends PaginationParams {
  date?: string;
}

export interface getActiveStaffUsersParams extends PaginationParams {
  roles: number[];
}
