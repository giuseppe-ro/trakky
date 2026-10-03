import { AuthProvider as ReactAuthProvider } from 'react-oidc-context';
import { ReactNode } from 'react';
import { getUserManager } from '@/auth/userManager';

function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ReactAuthProvider
      userManager={getUserManager()}
      onSigninCallback={() => {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }}
    >
      {children}
    </ReactAuthProvider>
  );
}

export default AuthProvider;
