import { LanguageOption } from '@/types/common';
import { EN_FLAG, JA_FLAG, VI_FLAG } from '@/constants/imageConst';
import { enUS, vi, ja, Locale } from 'date-fns/locale';
import { Language } from '@/enums';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: 'Tiếng Việt', value: Language.vi, icon: VI_FLAG },
  { label: 'English', value: Language.en, icon: EN_FLAG },
  { label: '日本語', value: Language.ja, icon: JA_FLAG },
];

// List of supported modules
export const SUPPORTED_MODULES = ['auth', 'common'];

// List of supported locales
export const SUPPORTED_LOCALES = LANGUAGE_OPTIONS.map((lang) => lang.value);

export const LOCALE_MAP: Record<string, Locale> = {
  vi,
  en: enUS,
  ja,
};

export const LOCALIZED_DATE_FORMATS: Record<string, string> = {
  vi: "EEEE, 'ngày' dd 'tháng' MM 'năm' yyyy",
  en: 'EEEE, MMMM do, yyyy',
  ja: 'yyyy年M月d日 (EEEE)',
};

export const MONTH_YEAR_FORMATS: Record<string, string> = {
  vi: `'Tháng' M 'năm' yyyy`, // Tháng 6 năm 2025
  en: `MMMM yyyy`, // June 2025
  ja: `yyyy年M月`, // 2025年6月
};
