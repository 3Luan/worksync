import { login, register } from '@/apis/auth';
import { LoginData, ApiResponse, RegisterData } from '@/types/api';
import { Auth } from '@/types/model';
import { baseResponseApi } from '@/utils/api-utils';
import { $t } from '@/utils/i18n';

export const authService = {
  async login(data: LoginData): Promise<ApiResponse<Auth>> {
    return baseResponseApi(() => login(data), $t('common.loginError'));
  },

  async register(data: RegisterData): Promise<ApiResponse<Auth>> {
    return baseResponseApi(() => register(data), $t('common.registerError'));
  },
};
