import { z } from 'zod';

export function getForgotPasswordSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string({ required_error: t('auth.errorEmailRequired') })
      .min(1, t('auth.errorEmailRequired'))
      .email(t('auth.errorEmailFormat')),
  });
}
