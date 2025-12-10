import axios from '@/utils/axios';
import { LoginData, RegisterData } from '@/types/api';

export const login = (data: LoginData) => {
  return axios.post('login', data);
};

export const register = (data: RegisterData) => {
  return axios.post('register', data);
};
