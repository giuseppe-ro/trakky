import {
  AuthProvider as ReactAuthProvider,
  AuthProviderProps,
} from 'react-oidc-context';
import { ReactNode } from 'react';
import { authAuthority, clientId } from '@/authConfig';
import { WebStorageStateStore } from 'oidc-client-ts';

function AuthProvider({ children }: { children: ReactNode }) {
  const oidcConfig: AuthProviderProps = {
    authority: authAuthority,
    client_id: clientId,
    redirect_uri: `${window.location.protocol}//${window.location.host}/`,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    scope: 'openid email profile',
    automaticSilentRenew: true,
    onSigninCallback: () => {
      window.history.replaceState({}, document.title, window.location.pathname);
    },
  };

  return <ReactAuthProvider {...oidcConfig}>{children}</ReactAuthProvider>;
}

export default AuthProvider;
