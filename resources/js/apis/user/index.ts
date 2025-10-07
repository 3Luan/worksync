import type { GetUsersParams, ChangePasswordParams, getActiveStaffUsersParams, ForgotPasswordData } from '@/types/api';
import type { User } from '@/types/model';
import axios from '@/utils/axios';

export const getUsers = (params: GetUsersParams) => {
  return axios.get('admin/user', { params });
};

export const getUser = (userId: number) => {
  return axios.get(`admin/user/${userId}/detail`);
};

export const createUser = (user: Partial<User>) => {
  return axios.post('admin/user/create', user);
};

export const updateUser = (userId: number, user: Partial<User>) => {
  return axios.put(`admin/user/${userId}/update`, user);
};

export const deleteUser = (userId: number) => {
  return axios.delete(`admin/user/${userId}/delete`);
};

export const restoreUser = (userId: number) => {
  return axios.post(`admin/user/${userId}/restore`);
};

export const forceDeleteUser = (userId: number) => {
  return axios.delete(`admin/user/${userId}/force-delete`);
};

export const forgotPassword = (data: ForgotPasswordData) => {
  return axios.post('forgot-password', data);
};

export const checkForgotPasswordToken = (token: string) => {
  return axios.get('check-forgot-password-token', {
    params: { token },
  });
};

export const resetPassword = (token: string, password: string) => {
  return axios.post('reset-password', { token, password });
};

export const getActiveStaffUsers = (params: getActiveStaffUsersParams) => {
  return axios.get('active-staffs', { params });
};

export const adminGetActiveStaffUsers = (params: getActiveStaffUsersParams) => {
  return axios.get('admin/user/active-staffs', { params });
};

export const changePassword = (password: ChangePasswordParams) => {
  return axios.put(`user/update-password`, password);
};

export const changePasswordAdmin = (password: ChangePasswordParams) => {
  return axios.put(`admin/update-password`, password);
};

export const locationAccessDenied = () => {
  return axios.post(`user/location-access-denied`);
};
