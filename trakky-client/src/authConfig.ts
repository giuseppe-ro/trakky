import { demoMode } from './constants';

export const serverUrl = import.meta.env.VITE_SERVER_URL ?? 'SERVER_URL';
export const skipAuth = import.meta.env.VITE_SKIP_AUTH === 'true' || demoMode;

export const authAuthority =
  import.meta.env.VITE_AUTH_AUTHORITY ?? 'AUTH_AUTHORITY';

export const clientId =
  import.meta.env.VITE_AUTH_CLIENT_ID ?? 'OPENID_AUTH_CLIENT_ID';
