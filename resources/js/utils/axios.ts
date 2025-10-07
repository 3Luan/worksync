import axios, { InternalAxiosRequestConfig } from 'axios';
import localToken from '@/utils/token';
import {
  LOCAL_STORAGE_AUTH_TOKEN,
  LOCAL_STORAGE_LANG,
  LOCAL_STORAGE_REFRESH_TOKEN,
  LOCAL_STORAGE_TOKEN_EXPIRY,
  API_LOGIN_PATH,
  TIME_LIMIT_DEFAULT,
} from '@/constants';
import { postRefreshToken } from '@/apis/refresh-token';
import { useAuthStore } from '@/stores/authStore';
import { HttpStatusCode, Language } from '@/enums';
import type { Auth } from '@/types/model';

const instance = axios.create({
  baseURL: '/api/v1',
});

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const isTokenExpired = () => {
  const exp = Number(localToken.get(LOCAL_STORAGE_TOKEN_EXPIRY));
  return exp - Date.now() / 1000 < TIME_LIMIT_DEFAULT;
};

const notifySubscribers = (newToken: string) => {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
};

const saveTokenData = (data: Auth) => {
  localToken.set(LOCAL_STORAGE_AUTH_TOKEN, data.access_token);
  localToken.set(LOCAL_STORAGE_REFRESH_TOKEN, data.refresh_token);
  localToken.set(LOCAL_STORAGE_TOKEN_EXPIRY, data.expires_in.toString() + Date.now() / 1000);
};

const refreshToken = async (): Promise<string> => {
  const refresh_token = localToken.get(LOCAL_STORAGE_REFRESH_TOKEN);
  if (!refresh_token) throw new Error('No refresh token');

  const response = await postRefreshToken({ refresh_token });
  saveTokenData(response.data.data);
  return response.data.data.access_token;
};

const attachTokenToRequest = (config: InternalAxiosRequestConfig, token: string | null): InternalAxiosRequestConfig => {
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

instance.interceptors.request.use(
  async (config) => {
    config.headers['X-Language'] = localToken.get(LOCAL_STORAGE_LANG) || Language.vi;

    if (config.url === API_LOGIN_PATH) return config;

    let token = localToken.get(LOCAL_STORAGE_AUTH_TOKEN);
    if (token && isTokenExpired()) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshToken();
          notifySubscribers(newToken);
          token = newToken;
        } catch (error) {
          useAuthStore().handleLogout();
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          subscribers.push((newToken) => {
            config.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(axios(config));
          });
        });
      }
    }

    return attachTokenToRequest(config, token);
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => {
    const apiResponse = response.data;

    if (apiResponse && typeof apiResponse === 'object' && 'success' in apiResponse) {
      if (!apiResponse.success) {
        return Promise.reject({
          response: {
            status: response.status,
            data: apiResponse,
          },
          message: apiResponse.title || 'An error occurred',
          errors: apiResponse.errors,
        });
      }

      return {
        ...response,
        originalData: response.data,
        data: apiResponse,
      };
    }

    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const config = error.config;

    if (status === HttpStatusCode.UNAUTHORIZED && config && config.url !== API_LOGIN_PATH) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshToken();

          notifySubscribers(newToken);
          const newConfig = attachTokenToRequest(config, newToken);
          return instance(newConfig);
        } catch (err) {
          useAuthStore().handleLogout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve) => {
          subscribers.push((newToken) => {
            const newConfig = attachTokenToRequest(config, newToken);
            resolve(instance(newConfig));
          });
        });
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
