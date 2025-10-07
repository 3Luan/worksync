import { APP_ROUTE_NAME } from '@/constants/url';

const adminChildRoutes = [
  {
    path: '',
    name: APP_ROUTE_NAME.ADMIN.DASHBOARD,
    component: () => import('@/pages/admin/dashboard/Dashboard.vue'),
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
    path: 'calendar-change-request',
    name: APP_ROUTE_NAME.ADMIN.CALENDAR_CHANGE_REQUEST,
    component: () => import('@/pages/admin/calendar-change-request/index.vue'),
    meta: {
      title: 'common.changeRequest',
      breadcrumb: 'calendar.scheduleChangeRequest',
    },
  },
  {
    path: 'calendar-leave-request',
    name: APP_ROUTE_NAME.ADMIN.CALENDAR_LEAVE_REQUEST,
    component: () => import('@/pages/admin/calendar-leave-request/index.vue'),
    meta: {
      title: 'common.leaveRequestManagement',
      breadcrumb: 'common.leaveRequestManagement',
    },
  },
  {
    path: 'calendar-special-work',
    name: APP_ROUTE_NAME.ADMIN.CALENDAR_SPECIAL_WORK,
    component: () => import('@/pages/admin/calendar-special-work/index.vue'),
    meta: {
      title: 'calendar.specialWorkManagement',
      breadcrumb: 'calendar.specialWorkManagement',
    },
  },
  {
    path: 'calendar-special-remote-work',
    name: APP_ROUTE_NAME.ADMIN.CALENDAR_SPECIAL_REMOTE_WORK,
    component: () => import('@/pages/admin/calendar-special-remote-work/index.vue'),
    meta: {
      title: 'calendar.specialRemoteWorkManagement',
      breadcrumb: 'calendar.specialRemoteWorkManagement',
    },
  },
  {
    path: 'calendar',
    name: APP_ROUTE_NAME.ADMIN.CALENDAR,
    component: () => import('@/pages/admin/calendar/index.vue'),
    meta: {
      title: 'common.workSchedule',
      breadcrumb: 'calendar.scheduleManagement',
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
    path: 'notification-emails',
    name: APP_ROUTE_NAME.ADMIN.NOTIFICATION_EMAILS,
    component: () => import('@/pages/admin/notification-emails/index.vue'),
    meta: {
      title: 'common.manageEmail',
      breadcrumb: 'common.manageEmail',
    },
  },
  {
    path: 'holiday',
    name: APP_ROUTE_NAME.ADMIN.HOLIDAY,
    component: () => import('@/pages/admin/holiday/index.vue'),
    meta: {
      title: 'common.holiday',
      breadcrumb: 'common.holiday',
    },
  },
  {
    path: 'compensation-work-request',
    name: APP_ROUTE_NAME.ADMIN.COMPENSATION_WORK_REQUEST,
    component: () => import('@/pages/admin/compensation-work-request/index.vue'),
    meta: {
      title: 'common.compensationWorkRequest',
      breadcrumb: 'common.compensationWorkRequest',
    },
  },
];
export default adminChildRoutes;
