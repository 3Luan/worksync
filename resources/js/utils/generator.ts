import { LOCALE_MAP } from '@/constants/i18n';
import { Language } from '@/enums';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Generates an array of months with localized labels.
 *
 * @param {string} [localeCode='vi'] - The locale code used for formatting month labels. Defaults to 'vi'.
 * @returns {{ value: number, label: string }[]} An array of 12 objects representing months,
 * each with a numeric `value` (1–12) and a localized `label`.
 *
 * @example
 * generateMonths('en');
 * // [
 * //   { value: 1, label: 'January' },
 * //   { value: 2, label: 'February' },
 * //   ...
 * // ]
 *
 * @example
 * generateMonths('vi');
 * // [
 * //   { value: 1, label: 'Tháng 1' },
 * //   { value: 2, label: 'Tháng 2' },
 * //   ...
 * // ]
 */
export const generateMonths = (localeCode: string = Language.vi) => {
  const loc = LOCALE_MAP[localeCode] || vi;

  return Array.from({ length: 12 }, (_, i): { value: number; label: string } => {
    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, i, 1);
    const useShortMonthFormat = localeCode === Language.vi;
    const label = useShortMonthFormat ? `Tháng ${i + 1}` : format(date, 'LLLL', { locale: loc });
    return {
      value: i + 1,
      label,
    };
  });
};

/**
 * Generates an array of years based on the specified range and offset.
 *
 * @param {number} [range=5] - The number of years to generate.
 * @param {number} [offset=-2] - The number of years to offset from the current year.
 * @returns {{ value: number, label: string }[]} An array of objects, each containing a `value` and `label`
 * representing a year.
 *
 * @example
 * generateYears(); // currentYear = 2025
 * // [
 * //   { value: 2023, label: '2023' },
 * //   { value: 2024, label: '2024' },
 * //   { value: 2025, label: '2025' },
 * //   { value: 2026, label: '2026' },
 * //   { value: 2027, label: '2027' },
 * // ]
 *
 * @example
 * generateYears(3, 0); // currentYear = 2025
 * // [
 * //   { value: 2025, label: '2025' },
 * //   { value: 2026, label: '2026' },
 * //   { value: 2027, label: '2027' },
 * // ]
 */
export const generateYears = (range = 5, offset = -2) => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: range }, (_, i) => {
    const year = currentYear + offset + i;
    return {
      value: year,
      label: `${year}`,
    };
  });
};
