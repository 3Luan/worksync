import axios from '@/utils/axios';
import { LoginPayload } from '@/types/api';

export const login = (payload: LoginPayload) => {
  return axios.post('login', payload);
};
