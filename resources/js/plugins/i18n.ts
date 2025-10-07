import { createI18n, I18n } from 'vue-i18n';
import { nextTick } from 'vue';
import { loadLocaleMessages } from '@/utils/load-locale-messages';
import { Language } from '@/enums';

let i18n: I18n;

export async function setupI18n() {
  if (!i18n) {
    const savedLocale = localStorage.getItem('lang') || Language.vi;

    i18n = createI18n({
      legacy: false,
      globalInjection: true,
      locale: savedLocale,
      fallbackLocale: Language.vi,
      messages: {},
    });

    await loadLocaleMessages(savedLocale, i18n);
    await setI18nLanguage(savedLocale);
  }
  return i18n;
}

export function i18nGlobal() {
  return i18n?.global.t as (key: string, args?: Record<string, any>) => string;
}

export async function setI18nLanguage(locale: string) {
  await loadLocaleMessages(locale, i18n);

  if (typeof i18n.global.locale === 'object' && 'value' in i18n.global.locale) {
    i18n.global.locale.value = locale;
  } else {
    i18n.global.locale = locale;
  }

  document.querySelector('html')?.setAttribute('lang', locale);
  localStorage.setItem('lang', locale);

  return nextTick();
}
