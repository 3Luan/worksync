import { MAX_DISPLAY_BADGE } from '@/constants';

/**
 * Formats a badge number for display.
 *
 * @param {number} badge - The badge count to format.
 * @returns {string | number} The formatted badge count.
 */
export const formatBadge = (badge: number): string | number => {
  if (badge > MAX_DISPLAY_BADGE) {
    return `${MAX_DISPLAY_BADGE}+`;
  }
  return badge;
};
