import { RouteRecordRaw } from 'vue-router';
import { APP_URL, APP_ROUTE_NAME } from '@/constants/url';

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: {
      title: 'Authentication',
      guest: true,
    },
    children: [
      {
        path: 'login',
        name: APP_ROUTE_NAME.AUTH.LOGIN,
        component: () => import('@/pages/auth/Login.vue'),
        meta: {
          title: 'auth.login',
          guest: true,
        },
      },
      {
        path: 'forgot-password',
        name: APP_ROUTE_NAME.AUTH.FORGOT_PASSWORD,
        component: () => import('@/pages/auth/ForgotPassword.vue'),
        meta: {
          title: 'auth.forgotPassword',
          guest: true,
        },
      },
      {
        path: 'reset-password',
        name: APP_ROUTE_NAME.AUTH.RESET_PASSWORD,
        component: () => import('@/pages/auth/ResetPassword.vue'),
        meta: {
          title: 'auth.resetPassword',
          guest: true,
        },
      },
      // Can add more auth routes here like register, forgot password, etc.
    ],
  },
  // Redirect /login to /auth/login for convenience
  {
    path: '/login',
    redirect: APP_URL.AUTH.LOGIN,
  },
];

export default authRoutes;
