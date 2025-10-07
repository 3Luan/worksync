import { i18nGlobal } from '@/plugins/i18n';

export const $t = (key: string, args?: Record<string, any>): string => {
  return i18nGlobal()(key, args);
};
