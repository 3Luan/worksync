import { DATE_FORMATS, DAY_OF_WEEK, TIME_SEGMENTS_FULL, TIME_SEGMENTS_SHORT } from '@/constants';
import { LOCALE_MAP, LOCALIZED_DATE_FORMATS } from '@/constants/i18n';
import { DateFormatStyle, Language, WeekdayFormat } from '@/enums';
import { format, parse, isValid, parseISO } from 'date-fns';
import { Locale, vi } from 'date-fns/locale';
import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
import { DateInput, YearMonth, YearMonthDay } from '@/types/common';
import { isString } from './types';

/**
 * Formats a date to a specified pattern.
 * @param DateInput - The DateInput to format, can be a Date object or an ISO string.
 * @param pattern - The format pattern to use, defaults to DATE_FORMATS.DATE.
 * @returns A formatted date string or an empty string if the date is invalid.
 * @example
 * formatDate(new Date(), 'dd/MM/yyyy'); // Returns the current date in 'dd/MM/yyyy' format
 * formatDate('2023-10-01'); // Returns '01-10-2023' if not pattern
 */
export const formatDate = ({
  date = new Date(),
  pattern = DATE_FORMATS.DATE,
}: {
  date?: DateInput;
  pattern?: string;
}): string => {
  const parsed = isString(date) ? parseISO(date) : date;
  return isValid(parsed) ? format(parsed, pattern) : '';
};

/**
 * Formats a date to a string with a slash format (dd/MM/yyyy).
 * @param date - The date to format, can be a Date object or an ISO string.
 * @returns A formatted date string in 'dd/MM/yyyy' format or an empty string if the date is invalid.
 * @example
 * formatDateWithSlash(new Date()); // Returns the current date in 'dd/MM/yyyy'
 */
export const formatDateWithSlash = (date: DateInput): string =>
  formatDate({ date, pattern: DATE_FORMATS.DATE_SLASH });

/**
 * Parses a time string to a Date object, assuming the time is for today.
 * If the time is invalid, it returns the current date.
 * @param time - The time string to parse, defaults to DATE_FORMATS.FULL_TIME.
 * @param pattern - The format pattern to use for parsing, defaults to DATE_FORMATS.FULL_TIME.
 * @returns A Date object representing the parsed time or the current date if invalid.
 * @example
 * parseTimeToToday('14:30', 'HH:mm'); // Returns new Date('2025-07-18T14:30:00') // if today is July 18, 2025
 */
export const parseTimeToToday = ({
  time,
  pattern = DATE_FORMATS.FULL_TIME,
}: {
  time: string;
  pattern?: string;
}): Date => {
  return parse(time, pattern, new Date());
};

/**
 * Formats a time string using the provided pattern.
 * Defaults to 'HH:mm' format and '—' as fallback if not provided.
 *
 * @param time - The time string to format.
 * @param pattern - Optional. Format pattern, defaults to 'HH:mm'.
 * @param fallback - Optional. Value to return if input is invalid. Defaults to '—'.
 * @param parsePattern - Optional. Pattern to use for parsing the time string.
 * @returns Formatted time string or fallback if invalid.
 *
 * @example
 * formatTime('14:30'); // Returns '14:30'
 * formatTime('14:30:00', 'HH:mm:ss'); // Returns '14:30:00'
 * formatTime('invalid', 'HH:mm', '—'); // Returns '—'
 * formatTime('14:30', 'HH:mm', '—', 'HH:mm'); // Returns '14:30'
 * formatTime('14:30', 'HH:mm:ss', '—', 'HH:mm'); // Returns '14:30:00'
 */
export const formatTime = ({
  time,
  pattern = DATE_FORMATS.TIME,
  fallback = '—',
  parsePattern,
}: {
  time?: string;
  pattern?: string;
  fallback?: string;
  parsePattern?: string;
}): string => {
  if (!time || time === 'null') return fallback;

  const parts = time.split(':');
  if (
    parts.length === (pattern === DATE_FORMATS.FULL_TIME ? TIME_SEGMENTS_FULL : TIME_SEGMENTS_SHORT)
  )
    return time;

  const parsed = parsePattern
    ? parseTimeToToday({ time, pattern: parsePattern })
    : parseTimeToToday({ time });

  if (!isValid(parsed)) return fallback;

  return format(parsed, pattern);
};

/**
 * Formats a time string to 'HH:mm:ss' format.
 * Uses 'HH:mm' parse pattern to convert time like '14:30' to '14:30:00'.
 *
 * @param time - The time string to format.
 * @returns A formatted time string in 'HH:mm:ss' format.
 * @example
 * formatTimeText('14:30'); // '14:30:00'
 */
export const formatTimeText = (time?: string): string | undefined => {
  return formatTime({
    time,
    pattern: DATE_FORMATS.FULL_TIME,
    fallback: '',
    parsePattern: DATE_FORMATS.TIME,
  });
};

/** * Formats a time string
 * @param time - The time string to format.
 * @returns A formatted time string in 'HH:mm' format or an empty string if invalid.
 * @example
 * formatTimeToHHMM('14:30'); // Returns '14:30'
 * formatTimeToHHMM('invalid'); // Returns ''
 */
export const formatTimeToHHMM = (time?: string): string => {
  return formatTime({ time, pattern: DATE_FORMATS.TIME, fallback: '' });
};

/**
 * Formats a date string to 'dd/MM/yyyy HH:mm' format.
 * @param dateString - The date string to format.
 * @returns A formatted date string in 'dd/MM/yyyy HH:mm' format or '—'.
 * @example
 * formatDateTime('2023-10-01T14:30:00'); // Returns '01/10/2023 14:30'
 * formatDateTime(''); // Returns '—'
 */
export const formatDateTime = (dateString?: string) => {
  if (!dateString) return '—';
  try {
    return format(new Date(dateString), DATE_FORMATS.SHORT_DATETIME_SLASH, { locale: vi });
  } catch (e) {
    return dateString;
  }
};

/**
 * Gets the formatted current time based on the locale.
 * @param localeCode - The locale code to use for formatting.
 * @returns A formatted string of the current time in the specified locale.
 * @example
 * getFormattedCurrentTime('en-US'); // Returns 'MM/dd/yyyy, HH:mm:ss' in US format
 * getFormattedCurrentTime('vi-VN'); // Returns 'dd/MM/yyyy, HH:mm:ss' in Vietnamese format
 */
export const getFormattedCurrentTime = (localeCode: string): string => {
  const loc = LOCALE_MAP[localeCode] || vi;
  const formatStr = LOCALIZED_DATE_FORMATS[localeCode] || LOCALIZED_DATE_FORMATS[Language.vi];

  return format(new Date(), formatStr, { locale: loc });
};

/**
 * Gets the number of days in a specific month of a given year.
 *
 * This function calculates the total number of days in the specified month, taking into account leap years
 * for February. It uses the Date object by setting the day to 0 of the next month, which returns the
 * last day of the specified month.
 *
 * @param year - The year for which to calculate the number of days (e.g., 2025).
 * @param month - The month (1-12, where 1 is January and 12 is December).
 * @returns The number of days in the specified month (e.g., 28, 29, 30, or 31).
 * @example
 * getDaysInMonth(2025, 2); // Returns 28 (February 2025 has 28 days)
 * getDaysInMonth(2024, 2); // Returns 29 (February 2024 is a leap year)
 * getDaysInMonth(2025, 4); // Returns 30 (April 2025 has 30 days)
 */
export const getDaysInMonth = ({ year, month }: YearMonth): number => {
  return new Date(year, month, 0).getDate();
};

/**
 * Gets the day of the week for the first day of a specific month of a given year.
 *
 * This function calculates the day of the week for the first day of the specified month, taking into account
 * that months in JavaScript start from 0 (January) to 11 (December). The getDay() method returns the day of
 * the week as a number (0 for Sunday, 1 for Monday, etc.).
 *
 * @param year - The year for which to calculate the day of the week (e.g., 2025).
 * @param month - The month (1-12, where 1 is January and 12 is December).
 * @returns The day of the week as a number (0 for Sunday, 1 for Monday, etc.).
 * @example
 * getFirstDayOfMonth(2025, 2); // Returns 0 (Sunday)
 * getFirstDayOfMonth(2024, 2); // Returns 1 (Monday)
 * getFirstDayOfMonth(2025, 4); // Returns 3 (Wednesday)
 */
export const getFirstDayOfMonth = ({ year, month }: YearMonth): number => {
  return new Date(year, month - 1, 1).getDay();
};

/**
 * Checks if a given date is today.
 * @param year - The year of the date.
 * @param month - The month of the date (1-12).
 * @param day - The day of the date (1-31).
 * @returns True if the date is today, false otherwise.
 * @example
 * isToday(2025, 7, 18); // Returns true if today is July 18, 2025
 */
export const isToday = ({ year, month, day }: YearMonthDay): boolean => {
  const today = new Date();
  return today.getFullYear() === year && today.getMonth() === month - 1 && today.getDate() === day;
};

/**
 * Checks if a given date falls on a weekend (Saturday or Sunday).
 * @param year - The year of the date.
 * @param month - The month of the date (1-12).
 * @param day - The day of the date (1-31).
 * @returns True if the date is a weekend, false otherwise.
 * @example
 * isWeekend(2025, 7, 19); // Returns true for Saturday
 * isWeekend(2025, 7, 20); // Returns true for Sunday
 * isWeekend(2025, 7, 21); // Returns false for Monday
 */
export const isWeekend = ({ year, month, day }: YearMonthDay): boolean => {
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  return dayOfWeek === DAY_OF_WEEK.SUNDAY || dayOfWeek === DAY_OF_WEEK.SATURDAY;
};

/**
 * Formats a date to a database string format (yyyy-MM-dd).
 * @param year - The year of the date.
 * @param month - The month of the date (1-12).
 * @param day - The day of the date (1-31).
 * @returns A formatted date string in 'yyyy-MM-dd' format.
 * @example
 * formatDateToDbString(2025, 7, 18); // Returns '2025-07-18'
 */
export const formatDateToDbString = ({ year, month, day }: YearMonthDay): string => {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

/**
 * Formats a date to a string with a slash format (dd/MM/yyyy).
 * @param date - The date to format, can be a Date object or an ISO string.
 * @returns A formatted date string in 'dd/MM/yyyy' format or an empty string if the date is invalid.
 * @example
 * formatDateWithSlash(new Date()); // Returns the current date in 'dd/MM/yyyy'
 */
export function formatWeekday({
  date,
  locale,
  formatStyle,
}: {
  date: Date;
  locale: string;
  formatStyle: WeekdayFormat;
}): string {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: formatStyle });
  return formatter.format(date);
}

/** * Formats a date to a localized string based on the provided locale and date style.
 * @param date - The date to format, can be a Date object or an ISO string.
 * @param locale - The locale to use for formatting.
 * @param dateStyle - The style of the date (e.g., 'short', 'medium', 'long', 'full').
 * @returns A formatted date string or an empty string if the date is invalid.
 * @example
 * formatLocalizedDate(new Date(), 'en-US', 'medium'); // Returns 'Oct 18, 2025'
 * formatLocalizedDate('2023-10-01', 'vi-VN', 'long'); // Returns '1 tháng 10, 2023'
 */
export function formatLocalizedDate({
  date,
  locale,
  dateStyle = DateFormatStyle.Medium,
}: {
  date: DateValue;
  locale: string;
  dateStyle?: DateFormatStyle;
}): string {
  const formatter = new DateFormatter(locale, { dateStyle });
  return formatter.format(date.toDate(getLocalTimeZone()));
}

/** * Formats a date to a localized string based on the provided locale and date style.
 * @param date - The date to format, can be a Date object or an ISO string.
 * @param locale - The locale to use for formatting.
 * @returns A formatted date string or an empty string if the date is invalid.
 * @example
 * formatDayOfWeek(new Date(), 'en-US'); // Returns 'Friday'
 * formatDayOfWeek('2023-10-01', 'vi-VN'); // Returns 'Chủ nhật'
 */
export function formatDayOfWeek({ date, locale }: { date: DateInput; locale: Locale }): string {
  return format(new Date(date), 'EEEE', { locale });
}

/**
 * Gets the year for a given offset from the current year.
 * @param offset The number of years to add (positive) or subtract (negative) from the current year.
 * @returns The calculated year as a number.
 * @example
 * getYearOffset(); // If current year is 2025, returns 2025 (current year)
 * getYearOffset(1); // If current year is 2025, returns 2026 (next year)
 * getYearOffset(-1); // If current year is 2025, returns 2024 (previous year)
 */
export const getYearOffset = ({ offset = 0 }: { offset?: number } = {}): number => {
  return new Date().getFullYear() + offset;
};

/**
 * Convert a date string like "11-07-2024" to a number like 11072024
 * @param dateStr - Date string in format "dd-MM-yyyy"
 * @returns number in format ddMMyyyy
 */
export const convertDateStringToNumber = (dateStr: string): number => {
  return Number(dateStr.replace(/-/g, ''));
};
