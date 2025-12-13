import { z } from 'zod';

export const getUserSchema = (t: (key: string) => string, isEdit: boolean) => {
  return z.object({
    first_name: z
      .string({ required_error: t('auth.errorFirstNameRequired') })
      .min(1, t('auth.errorFirstNameRequired')),
    last_name: z
      .string({ required_error: t('auth.errorLastNameRequired') })
      .min(1, t('auth.errorLastNameRequired')),
    email: z
      .string({ required_error: t('auth.errorEmailRequired') })
      .email(t('auth.errorEmailFormat')),
    password: isEdit
      ? z
          .string()
          .optional()
          .refine((val) => !val || val.length >= 8, {
            message: t('auth.errorNewPasswordMin'),
          })
      : z
          .string({ required_error: t('auth.errorPasswordRequired') })
          .min(8, t('auth.errorPasswordRequired')),
  });
};
