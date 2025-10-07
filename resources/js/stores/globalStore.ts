import { defineStore } from 'pinia';
import type { CalendarUserFilter } from '@/types/store';

export const useCalendarFilterStore = defineStore('calendarFilter', {
  state: () => ({
    user: null as CalendarUserFilter | null,
  }),

  actions: {
    setUser(user: CalendarUserFilter) {
      this.user = user;
    },
    clearUser() {
      this.user = null;
    },
  },
});
