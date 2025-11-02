import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import axios from 'axios';
import router from './router/index';
import { setupI18n } from './plugins/i18n';
import '@/echo.js';

// Set up Axios defaults
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '/api';

// Get CSRF token from meta tag
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
  axios.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
}

// Create Vue app with plugins
async function initializeApp() {
  const i18n = await setupI18n();
  const app = createApp(App);
  app.use(createPinia());
  app.use(router);
  app.use(i18n);

  app.mount('#app');
}
initializeApp();
