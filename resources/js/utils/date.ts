import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';

/**
 * Disable future dates.
 * @param date - The date to check.
 * @param includeToday - If true, today is also disabled. Default: true.
 */
export const disableDates = ({ date, includeToday = true }: { date: DateValue; includeToday?: boolean }): boolean => {
  const now = today(getLocalTimeZone());

  if (date.year > now.year) return true;
  if (date.year < now.year) return false;

  if (date.month > now.month) return true;
  if (date.month < now.month) return false;

  return includeToday ? date.day >= now.day : date.day > now.day;
};
