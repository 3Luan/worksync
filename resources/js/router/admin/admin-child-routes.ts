import { APP_ROUTE_NAME } from '@/constants/url';

const adminChildRoutes = [
  {
    path: '',
    name: APP_ROUTE_NAME.ADMIN.DASHBOARD,
    component: () => import('@/pages/admin/dashboard/index.vue'),
    meta: {
      title: 'common.overview',
    },
  },
  {
    path: 'users',
    name: APP_ROUTE_NAME.ADMIN.USER.INDEX,
    component: () => import('@/pages/admin/users/index.vue'),
    meta: {
      title: 'user.employeeList',
      breadcrumb: 'user.employeeList',
    },
  },
  {
    path: 'users/create',
    name: APP_ROUTE_NAME.ADMIN.USER.CREATE,
    component: () => import('@/pages/admin/users/[id]/edit.vue'),
    meta: {
      title: 'user.addEmployee',
      breadcrumb: 'user.addEmployee',
    },
  },
  {
    path: 'users/:id/edit',
    name: APP_ROUTE_NAME.ADMIN.USER.EDIT,
    component: () => import('@/pages/admin/users/[id]/edit.vue'),
    meta: {
      title: 'user.editEmployee',
      breadcrumb: 'user.editEmployee',
    },
  },
  {
    path: 'update-password',
    name: APP_ROUTE_NAME.ADMIN.UPDATE_PASSWORD,
    component: () => import('@/pages/shared/UpdatePassword.vue'),
    meta: {
      title: 'auth.changePassword',
      breadcrumb: 'auth.changePassword',
    },
  },
  {
    path: 'profile',
    name: APP_ROUTE_NAME.ADMIN.PROFILE,
    component: () => import('@/pages/admin/profile/index.vue'),
    meta: {
      title: 'common.profile',
      breadcrumb: 'common.profile',
    },
  },
];
export default adminChildRoutes;
