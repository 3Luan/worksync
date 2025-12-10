// echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

let echoInstance: Echo<any> | null = null;

export function initEcho(token: string) {
  if (echoInstance) {
    echoInstance.disconnect(); // Nếu đã có instance trước đó, disconnect
  }

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  return echoInstance;
}

export function getEcho() {
  return echoInstance;
}

// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// window.Pusher = Pusher;

// window.Echo = new Echo({
//   broadcaster: 'reverb',
//   key: import.meta.env.VITE_REVERB_APP_KEY,
//   wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
//   wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
//   forceTLS: false,
//   enabledTransports: ['ws', 'wss'],
//   auth: {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
//     },
//   },
// });
