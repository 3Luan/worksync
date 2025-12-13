import type {
  GetUsersParams,
  ChangePasswordParams,
  getActiveStaffUsersParams,
  ForgotPasswordData,
} from '@/types/api';
import type { User } from '@/types/model';
import axios from '@/utils/axios';

export const userAPI = {
  getList(params: GetUsersParams) {
    return axios.get('user', { params });
  },

  create(user: Partial<User>) {
    return axios.post('user/create', user);
  },

  getByID(userId: number) {
    return axios.get(`user/${userId}/detail`);
  },

  update(userId: number, user: Partial<User>) {
    return axios.put(`user/${userId}/update`, user);
  },

  forgotPassword(data: ForgotPasswordData) {
    return axios.post('forgot-password', data);
  },

  checkForgotPasswordToken(token: string) {
    return axios.get('check-forgot-password-token', {
      params: { token },
    });
  },

  resetPassword(token: string, password: string) {
    return axios.post('reset-password', { token, password });
  },

  changePassword(params: ChangePasswordParams) {
    return axios.put(`user/update-password`, params);
  },

  getActives(params: getActiveStaffUsersParams) {
    return axios.get('user/actives', { params });
  },

  // Admin

  getListAdmin(params: GetUsersParams) {
    return axios.get('admin/user', { params });
  },

  getByIDAdmin(userId: number) {
    return axios.get(`admin/user/${userId}/detail`);
  },

  createAdmin(user: Partial<User>) {
    return axios.post('admin/user/create', user);
  },

  updateAdmin(userId: number, user: Partial<User>) {
    return axios.put(`admin/user/${userId}/update`, user);
  },

  deleteAdmin(userId: number) {
    return axios.delete(`admin/user/${userId}/delete`);
  },

  restoreAdmin(userId: number) {
    return axios.post(`admin/user/${userId}/restore`);
  },

  getActivesAdmin(params: getActiveStaffUsersParams) {
    return axios.get('admin/user/actives', { params });
  },

  changePasswordAdmin(password: ChangePasswordParams) {
    return axios.put(`admin/update-password`, password);
  },
};
