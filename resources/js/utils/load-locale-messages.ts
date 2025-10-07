import { I18n } from 'vue-i18n';
import { handleError } from '@/utils/handle-error';
import { LocaleMessage } from '@/types/common';
import { SUPPORTED_LOCALES, SUPPORTED_MODULES } from '@/constants/i18n';
import { $t } from './i18n';

export const loadLocaleMessages = async (locale: string, i18n: I18n) => {
  if (!SUPPORTED_LOCALES.includes(locale)) return;

  const messages: Record<string, LocaleMessage> = {};

  for (const mod of SUPPORTED_MODULES) {
    try {
      const msgModule = await import(`@/locales/${locale}/${mod}.json`);
      messages[mod] = msgModule.default;
    } catch (error) {
      console.error(error);
      handleError('', {
        title: $t('common.loadLanguageError'),
      });
    }
  }

  if (Object.keys(messages).length > 0) {
    i18n.global.setLocaleMessage(locale, messages);
  }
};
