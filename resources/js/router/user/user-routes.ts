import { ROLE } from '@/constants';
import { APP_ROUTE_NAME } from '@/constants/url';

const userRoute = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: {
      title: 'common.home',
      breadcrumb: 'common.home',
    },
    children: [
      {
        path: '/dashboard',
        name: APP_ROUTE_NAME.USER.DASHBOARD,
        component: () => import('@/pages/user/dashboard/index.vue'),
        meta: {
          title: 'common.dashboard',
        },
      },
      {
        path: '/users',
        name: APP_ROUTE_NAME.USER.INDEX,
        component: () => import('@/pages/admin/users/index.vue'),
        meta: {
          title: 'user.employeeList',
          breadcrumb: 'user.employeeList',
          requiredRoles: [ROLE.ACCOUNTANT],
        },
      },
      {
        path: '/update-password',
        name: APP_ROUTE_NAME.USER.UPDATE_PASSWORD,
        component: () => import('@/pages/shared/UpdatePassword.vue'),
        meta: {
          title: 'auth.changePassword',
        },
      },
    ],
  },
];
export default userRoute;
