import type { ApiResponse, ChangePasswordParams, ForgotPasswordData, GetUsersParams, getActiveStaffUsersParams } from '@/types/api';
import { baseResponseApi } from '@/utils/api-utils';
import type { User } from '@/types/model';
import { $t } from '@/utils/i18n';
import { userAPI } from '@/apis/user';

/**
 * Service for handling user-related operations
 */
export const userService = {
  /**
   * Get paginated list of users with optional search
   */
  async getList(params: GetUsersParams): Promise<ApiResponse<any>> {
    return baseResponseApi(() => userAPI.getList(params), $t('common.fetchUsersError'));
  },

  // Get user details
  async getUser(params: { userId: number }): Promise<ApiResponse<any>> {
    return baseResponseApi(() => userAPI.getByID(params.userId), $t('common.fetchUserError'));
  },

  // /**
  //  * Get a single user by ID
  //  */
  // async getUser(params: { userId: number }): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => getUser(params.userId),
  //     $t('common.fetchUserError')
  //   );
  // },

  // /**
  //  * Create a new user
  //  */
  // async createUser(user: Partial<User>): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => createUser(user),
  //     $t('common.createUserError')
  //   );
  // },

  // /**
  //  * Update an existing user
  //  */
  // async updateUser(params: { userId: number; user: Partial<User> }): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => updateUser(params.userId, params.user),
  //     $t('common.updateUserError')
  //   );
  // },

  // /**
  //  * Delete a user (set as inactive)
  //  */
  // async deleteUser(params: { userId: number }): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => deleteUser(params.userId),
  //     $t('common.deleteUserError')
  //   );
  // },

  // /**
  //  * Restore a deleted user
  //  */
  // async restoreUser(params: { userId: number }): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => restoreUser(params.userId),
  //     $t('common.restoreUserError')
  //   );
  // },

  // /**
  //  * Leader get a list avtive users
  //  */
  // async getActiveStaffUsers(params: getActiveStaffUsersParams): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => getActiveStaffUsers(params),
  //     $t('common.fetchNormalStaffUsersError')
  //   );
  // },

  // /**
  //  * Admin get a list avtive users
  //  */
  // async adminGetActiveStaffUsers(params: getActiveStaffUsersParams): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => adminGetActiveStaffUsers(params),
  //     $t('common.adminFetchNormalStaffUsersError')
  //   );
  // },

  // async changePassword(params: ChangePasswordParams): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => changePassword(params),
  //     $t('common.changePasswordError')
  //   );
  // },

  // async changePasswordAdmin(params: ChangePasswordParams): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => changePasswordAdmin(params),
  //     $t('common.adminChangePasswordError')
  //   );
  // },

  // /**
  //  * Forgot password
  //  */
  // async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => forgotPassword(data),
  //     $t('common.forgotPasswordError')
  //   );
  // },

  // /**
  //  * Check forgot password token
  //  */
  // async checkForgotPasswordToken(params: { token: string }): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => checkForgotPasswordToken(params.token),
  //     $t('common.checkForgotPasswordTokenError')
  //   );
  // },

  // /**
  //  * Reset password
  //  */
  // async resetPassword(params: { token: string; password: string }): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => resetPassword(params.token, params.password),
  //     $t('common.resetPasswordError')
  //   );
  // },

  // /**
  //  * Handle location access denied
  //  */
  // async locationAccessDenied(): Promise<ApiResponse<any>> {
  //   return baseResponseApi(
  //     () => locationAccessDenied(),
  //     $t('common.locationAccessDeniedEmailError')
  //   );
  // }
};
