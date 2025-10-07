import { login as loginApi } from '@/apis/auth';
import { LoginPayload, ApiResponse } from '@/types/api';
import { Auth } from '@/types/model';
import { baseResponseApi } from '@/utils/api-utils';
import { $t } from '@/utils/i18n';

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<Auth>> {
    return baseResponseApi(
      () => loginApi(payload),
      $t('common.loginError')
    );
  }
};
