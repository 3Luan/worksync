import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import adminRoutes from './admin/admin-routes';
import userRoutes from './user/user-routes';
import authRoutes from './auth/auth-routes';
import { APP_ROUTE_NAME, APP_URL, ENTRY_URL } from '@/constants/url';
import { useAuthStore } from '@/stores/authStore';
import { getUser, isAdminPath, isAdminRole, isUserPath, rootRedirect } from '@/utils/role';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: rootRedirect,
  },
  {
    path: '/:pathMatch(.*)*',
    name: APP_ROUTE_NAME.NOT_FOUND,
    component: () => import('../pages/NotFound.vue'),
    meta: {
      title: '404 Not Found',
      public: true,
    },
  },
  ...adminRoutes,
  ...userRoutes,
  ...authRoutes,
];

const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

// Update document title and handle authentication
router.beforeEach((to, _, next) => {
  // Check if route requires authentication
  const user = getUser();
  const userRole = user?.role;
  const requiresAuth = to.matched.some((record) => !record.meta.guest && !record.meta.public);
  const guestOnly = to.matched.some((record) => record.meta.guest);

  // Route requires auth but user not logged in
  if (requiresAuth && !user) {
    useAuthStore().handleLogout();
  }

  // Allow access to the reset password page even if the user is already logged in
  if (to.path === APP_URL.AUTH.RESET_PASSWORD) {
    return next();
  }

  // Guest-only route but already logged in
  if (guestOnly && user) {
    return next(isAdminRole(user.role) ? ENTRY_URL.ADMIN : ENTRY_URL.DASHBOARD);
  }

  // Check if route has required roles
  const requiredRoles = to.matched.flatMap((record) => record.meta.requiredRoles || []);

  if (requiredRoles.length > 0 && user && !requiredRoles.includes(userRole)) {
    return next(ENTRY_URL.DASHBOARD);
  }

  if (user) {
    if (!isAdminRole(userRole) && isAdminPath(to.fullPath)) {
      return next(ENTRY_URL.USER);
    }

    if (isAdminRole(userRole) && isUserPath(to.fullPath)) {
      return next(ENTRY_URL.ADMIN);
    }
  }

  // Route doesn't require auth or is public
  next();
});

export default router;
