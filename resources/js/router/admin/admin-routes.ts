import adminChildRoutes from './admin-child-routes';

const adminRoute = [
  {
    path: '/admin',
    name: 'AdminHome',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: {
      title: 'common.home',
      breadcrumb: 'common.home',
    },
    children: adminChildRoutes,
  },
];
export default adminRoute;
