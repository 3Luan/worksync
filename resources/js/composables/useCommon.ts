import { LOCALE_MAP } from '@/constants/i18n';
import { generateMonths } from '@/utils/generator';
import { formatDayOfWeek, parseTimeToToday } from '@/utils/time';
import { differenceInMinutes } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useI18n } from 'vue-i18n';

export function useCommon() {
  const { t: $t, locale } = useI18n();

  const MONTH_OPTIONS = generateMonths(locale.value);

  const MONTH_OPTIONS_WITH_ALL = [{ value: 0, label: $t('common.all') }, ...MONTH_OPTIONS];

  const getDayName = (date: string): string => {
    const selectedLocale = LOCALE_MAP[locale.value] || vi;
    return formatDayOfWeek({ date, locale: selectedLocale });
  };

  const calculateBreakTime = (startBreak: string, endBreak: string): string => {
    if (!startBreak || !endBreak) return '';
    const start = parseTimeToToday({ time: startBreak });
    const end = parseTimeToToday({ time: endBreak });
    const minutes = differenceInMinutes(end, start);
    return $t('common.minute', { count: minutes });
  };

  return {
    MONTH_OPTIONS,
    MONTH_OPTIONS_WITH_ALL,
    getDayName,
    calculateBreakTime,
  };
}
