import { I18n } from 'vue-i18n';
import { handleError } from '@/utils/handle-error';
import { LocaleMessage } from '@/types/common';
import { SUPPORTED_LOCALES, SUPPORTED_MODULES } from '@/constants/i18n';
import { $t } from './i18n';

export const loadLocaleMessages = async (locale: string, i18n: I18n) => {
  if (!SUPPORTED_LOCALES.includes(locale)) return;

  const messages: Record<string, LocaleMessage> = {};
  const allLocaleFiles = import.meta.glob('@/locales/**/*.json', { eager: true });

  for (const mod of SUPPORTED_MODULES) {
    try {
      const matchKey = Object.keys(allLocaleFiles).find((path) =>
        path.includes(`/${locale}/${mod}.json`),
      );

      if (matchKey) {
        messages[mod] = (allLocaleFiles[matchKey] as any).default;
      } else {
        console.warn(`${$t('common.missing_locale')}: ${locale}/${mod}.json`);
      }
    } catch (error) {
      console.error(error);
      handleError('', {
        title: $t('common.load_language_error'),
      });
    }
  }

  if (Object.keys(messages).length > 0) {
    i18n.global.setLocaleMessage(locale, messages);
  }
};
