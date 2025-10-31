import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY ?? 'local',
  wsHost: import.meta.env.VITE_REVERB_HOST ?? 'localhost',
  wsPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
  forceTLS: false,
  enabledTransports: ['ws'], // chỉ dùng ws
});
