import axios from '@/utils/axios';
import type { RefreshTokenData } from '@/types/api';

export const postRefreshToken = async (data: RefreshTokenData) => {
  return axios.post('/refresh_token', data);
};
