const env = import.meta.env;

console.log('Environment state:', {
  MODE: env.MODE,
  DEV: env.DEV,
  VITE_WS_HOST: env.VITE_WS_HOST,
  VITE_WS_PORT: env.VITE_WS_PORT,
});

if (!env.VITE_WS_HOST || !env.VITE_WS_PORT) {
  console.warn(
    'WebSocket configuration is incomplete. Using default values. ' +
    'Make sure you have a .env file in the apps/client directory with VITE_WS_HOST and VITE_WS_PORT defined.'
  );
}

export const wsConfig = {
  host: env.VITE_WS_HOST,
  port: env.VITE_WS_PORT,
}; 
