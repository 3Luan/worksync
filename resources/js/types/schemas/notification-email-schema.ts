import { z } from 'zod';

export const notificationEmailSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string({ required_error: t('common.emailRequired') })
      .min(1, t('common.emailRequired'))
      .email(t('common.emailInvalid')),
  });
