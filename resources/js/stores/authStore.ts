import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import router from '@/router';
import axios from '@/utils/axios';
import localToken from '@/utils/token';
import { LOCAL_STORAGE_AUTH_TOKEN, LOCAL_STORAGE_REFRESH_TOKEN, LOCAL_STORAGE_TOKEN_EXPIRY, LOCAL_STORAGE_USER } from '@/constants';
import { APP_URL } from '@/constants/url';
import { authService } from '@/services/auth-service';
import { Auth, User } from '@/types/model';
import { isAccountantRole, isAdminRole, isLeaderRole, isStaffRole } from '@/utils/role';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'));
  const tokenExpiry = ref<number | null>(localStorage.getItem('token_expiry') ? parseInt(localStorage.getItem('token_expiry') || '0') : null);
  const isLoading = ref(false);
  const error = ref('');

  const isAuthenticated = computed(() => !!token.value);
  const fullName = computed(() => (user.value ? `${user.value.last_name} ${user.value.first_name}` : ''));
  const isAdmin = computed(() => isAdminRole(user.value?.role));
  const isAccountant = computed(() => isAccountantRole(user.value?.role));
  const isStaff = computed(() => isStaffRole(user.value?.role));
  const isLeader = computed(() => isLeaderRole(user.value?.role));
  const currentUser = () => JSON.parse(localStorage.getItem('user') || 'null');

  async function handleLogin(credentials: { email: string; password: string }) {
    try {
      isLoading.value = true;
      error.value = '';

      const response = await authService.login({
        email: credentials.email,
        password: credentials.password,
      });
      const data = response.data as Auth;

      // Store auth data
      token.value = data.access_token;
      refreshToken.value = data.refresh_token;
      user.value = data.user;

      // Calculate token expiry
      const expiryTime = Date.now() + data.expires_in * 1000;
      tokenExpiry.value = expiryTime;

      // // Save to localStorage
      localToken.set(LOCAL_STORAGE_AUTH_TOKEN, data.access_token);
      localToken.set(LOCAL_STORAGE_REFRESH_TOKEN, data.refresh_token);
      localToken.set(LOCAL_STORAGE_TOKEN_EXPIRY, expiryTime.toString());
      localToken.set(LOCAL_STORAGE_USER, JSON.stringify(data.user));

      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      error.value = err.response?.data?.message || 'auth.invalidLogin';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function handleLogout() {
    // Clear authentication data
    token.value = null;
    refreshToken.value = null;
    tokenExpiry.value = null;
    user.value = null;

    localToken.remove(LOCAL_STORAGE_AUTH_TOKEN);
    localToken.remove(LOCAL_STORAGE_REFRESH_TOKEN);
    localToken.remove(LOCAL_STORAGE_TOKEN_EXPIRY);
    localToken.remove(LOCAL_STORAGE_USER);

    // Clear auth header
    delete axios.defaults.headers.common['Authorization'];

    // Redirect to login
    router.push(APP_URL.AUTH.LOGIN);
  }

  // Remove error message
  function removeErrorMessage() {
    error.value = '';
  }

  return {
    currentUser,
    user,
    token,
    refreshToken,
    tokenExpiry,
    isLoading,
    error,
    isAuthenticated,
    fullName,
    isAdmin,
    isAccountant,
    isStaff,
    isLeader,
    handleLogin,
    handleLogout,
    removeErrorMessage,
  };
});
