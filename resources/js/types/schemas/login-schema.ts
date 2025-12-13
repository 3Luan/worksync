import { z } from 'zod';

export function getLoginSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string({ required_error: t('auth.errorEmailRequired') })
      .min(1, t('auth.errorEmailRequired'))
      .email(t('auth.errorEmailFormat')),
    password: z
      .string({ required_error: t('auth.errorPasswordRequired') })
      .min(8, t('auth.errorNewPasswordMin')),
  });
}
