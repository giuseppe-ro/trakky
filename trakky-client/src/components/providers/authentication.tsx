import React, { useEffect, useState } from 'react';
import { AuthProvider, TAuthConfig } from 'react-oauth2-code-pkce';
import { GetOpenIdConfiguration } from '@/infrastructure/auth';
import Spinner from '@/components/ui/spinner';
import { demoMode, StorageKey } from '@/constants';
import { clientId } from '@/authConfig';
import { AppError } from '@/models/app-error';

function AuthenticationCustomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [err, setError] = useState<AppError>();
  const [authConfig, setAuthConfig] = useState<TAuthConfig>();

  useEffect(() => {
    if (demoMode) return;

    const fetchConfig = async (): Promise<AppError | null | undefined> => {
      const { data, error } = await GetOpenIdConfiguration();
      if (data) {
        const config = {
          autoLogin: false,
          clientId,
          authorizationEndpoint: data.authorization_endpoint,
          logoutEndpoint: data.end_session_endpoint,
          tokenEndpoint: data.token_endpoint,
          redirectUri: `${window.location.protocol}//${window.location.host}/`,
          scope: data.scopes_supported.join(' '),
        } as TAuthConfig;

        setAuthConfig(config);
        localStorage.setItem(StorageKey.OpenIdConfig, JSON.stringify(config));
      }

      return error;
    };

    const existingAuthConfig = localStorage.getItem(StorageKey.OpenIdConfig);
    if (existingAuthConfig) {
      setAuthConfig(JSON.parse(existingAuthConfig) as unknown as TAuthConfig);
      return;
    }

    fetchConfig().then((error) => {
      if (error) {
        setError(error);
      }
    });
  }, []);

  if (demoMode) {
    return children;
  }
  if (authConfig) {
    return <AuthProvider authConfig={authConfig}>{children}</AuthProvider>;
  }
  if (err) {
    return <div>Could not authenticate!</div>;
  }
  return (
    <Spinner className="flex flex-row justify-center align-middle my-12" />
  );
}

export default AuthenticationCustomProvider;
