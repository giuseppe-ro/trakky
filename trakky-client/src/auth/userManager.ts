import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { authAuthority, clientId, skipAuth } from '@/authConfig';

let manager: UserManager | undefined;

export function getUserManager(): UserManager {
  if (!manager) {
    manager = new UserManager({
      authority: authAuthority,
      client_id: clientId,
      redirect_uri: `${window.location.origin}/`,
      silent_redirect_uri: `${window.location.origin}/silent-refresh.html`,
      post_logout_redirect_uri: window.location.origin,
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      scope: 'openid email profile',
      loadUserInfo: true,
      automaticSilentRenew: true,
      validateSubOnSilentRenew: true,
      revokeTokensOnSignout: true,
    });
  }

  return manager;
}

export async function getAccessToken(): Promise<string | null> {
  if (skipAuth) {
    return null;
  }

  const auth = getUserManager();
  const user = await auth.getUser();

  if (!user) {
    return null;
  }

  if (user.expired) {
    return (await auth.signinSilent())?.access_token ?? null;
  }

  return user.access_token ?? null;
}
