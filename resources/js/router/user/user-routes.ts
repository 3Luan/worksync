import { APP_ROUTE_NAME } from '@/constants/url';

const userRoute = [
  {
    path: '/home',
    name: 'home',
    component: () => import('@/layouts/UserLayout.vue'),
    meta: {
      title: 'common.home',
      breadcrumb: 'common.home',
    },
    children: [
      {
        path: '/home',
        name: APP_ROUTE_NAME.USER.INDEX,
        component: () => import('@/pages/user/home/index.vue'),
        meta: {
          title: 'common.home',
          breadcrumb: 'common.home',
        },
      },
      {
        path: '/update-password',
        name: APP_ROUTE_NAME.USER.UPDATE_PASSWORD,
        component: () => import('@/pages/shared/UpdatePassword.vue'),
        meta: {
          title: 'common.change_password',
        },
      },
      {
        path: '/profile',
        name: APP_ROUTE_NAME.USER.PROFILE,
        component: () => import('@/pages/user/profile/index.vue'),
        meta: {
          title: 'common.profile',
          breadcrumb: 'common.profile',
        },
      },
      {
        path: '/messages',
        name: APP_ROUTE_NAME.USER.MESSAGES,
        component: () => import('@/pages/user/messages/index.vue'),
        meta: {
          title: 'common.messages',
          breadcrumb: 'common.messages',
        },
        children: [
          {
            path: ':id',
            name: APP_ROUTE_NAME.USER.MESSAGE_DETAIL,
            component: () => import('@/pages/user/messages/index.vue'),
            props: true,
          },
        ],
      },
    ],
  },
];
export default userRoute;
