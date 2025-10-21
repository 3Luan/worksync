export const APP_URL = {
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    USER: {
      INDEX: '/admin/users',
      CREATE: '/admin/users/create',
      EDIT: (id: number) => `/admin/users/${id}/edit`,
    },
    UPDATE_PASSWORD: '/admin/update-password',
  },
  USER: {
    HOME: '/home',
    DASHBOARD: '/dashboard',
    MESSAGES: '/messages',
    UPDATE_PASSWORD: '/update-password',
  },
} as const;

export const APP_ROUTE_NAME = {
  AUTH: {
    LOGIN: 'auth.login',
    FORGOT_PASSWORD: 'auth.forgot-password',
    RESET_PASSWORD: 'auth.reset-password',
  },
  ADMIN: {
    DASHBOARD: 'admin.dashboard.index',
    USER: {
      INDEX: 'admin.user.index',
      CREATE: 'admin.users.create',
      EDIT: 'admin.user.edit',
    },
    UPDATE_PASSWORD: 'admin.update-password.index',
    PROFILE: 'admin.profile.index',
  },
  USER: {
    INDEX: 'user.index',
    WORKSYNC: 'worksync.index',
    UPDATE_PASSWORD: 'update-password.index',
    PROFILE: 'user.profile.index',
    MESSAGES: 'user.messages.index',
    MESSAGE_DETAIL: 'user.message.detail',
  },
  NOT_FOUND: 'not-found',
} as const;

export const ENTRY_URL = {
  ADMIN: APP_URL.ADMIN.DASHBOARD,
  AUTH: APP_URL.AUTH.LOGIN,
  USER: APP_URL.USER.MESSAGES,
} as const;
