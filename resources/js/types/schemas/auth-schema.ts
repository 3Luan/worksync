import { z } from 'zod';

export function getChangePasswordSchema(t: (key: string) => string) {
  return z
    .object({
      current_password: z
        .string({ required_error: t('auth.errorCurrentPasswordRequired') })
        .min(1, t('auth.errorCurrentPasswordRequired')),
      new_password: z
        .string({ required_error: t('auth.errorNewPasswordMin') })
        .min(8, t('auth.errorNewPasswordMin')),
      confirm_password: z
        .string({ required_error: t('auth.errorConfirmPasswordRequired') })
        .min(1, t('auth.errorConfirmPasswordMin')),
    })
    .refine((data) => data.new_password !== data.current_password, {
      message: t('auth.errorNewPasswordSameAsCurrent'),
      path: ['new_password'],
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t('auth.errorConfirmPasswordNotMatch'),
      path: ['confirm_password'],
    });
}

export const resetPasswordSchema = (t: (key: string) => string) => {
  return z
    .object({
      password: z
        .string({ required_error: t('auth.errorConfirmPasswordMin') })
        .min(8, t('auth.errorNewPasswordMin')),
      confirm_password: z
        .string({ required_error: t('auth.errorConfirmPasswordRequired') })
        .min(1, t('auth.errorConfirmPasswordMin')),
    })
    .refine((data) => data.password === data.confirm_password, {
      message: t('auth.errorConfirmPasswordNotMatch'),
      path: ['confirm_password'],
    });
};
