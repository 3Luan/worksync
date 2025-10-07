import { z } from 'zod';

export const getHolidaySchema = (t: (key: string) => string) => {
  return z.object({
    date: z.string().nonempty(t('common.dateRequired')),
    name: z.string().nonempty(t('common.nameHolidayRequired')),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
  });
};
