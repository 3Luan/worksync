import { LOCAL_STORAGE_AUTH_TOKEN } from '@/constants';

interface TokenUtils {
  get(name: string): string;
  set(name: string, token: string): void;
  remove(name: string): void;
  reset(name: string): void;
  getAuth(): { authorization: string };
}

const tokenUtils: TokenUtils = {
  get(name: string) {
    return localStorage.getItem(name) || '';
  },
  set(name: string, token: string) {
    localStorage.setItem(name, token);
  },
  remove(name: string) {
    localStorage.removeItem(name);
  },
  reset(name: string) {
    localStorage.removeItem(name);
  },
  getAuth(): { authorization: string } {
    return {
      authorization: 'Bearer ' + this.get(LOCAL_STORAGE_AUTH_TOKEN),
    };
  },
};

export default tokenUtils;
