import React, { useEffect, useState } from "react";
import { AuthProvider, TAuthConfig } from "react-oauth2-code-pkce";
import { getOpenIdConfiguration } from "@/infrastructure/auth.tsx";
import Spinner from "@/components/ui/spinner.tsx";
import { demoMode, StorageKey } from "@/constants.ts";
import { clientId } from "@/authConfig.ts";


export function AuthenticationCustomProvider({ children }: { children: React.ReactNode }) {
  const [authConfig, setAuthConfig] = useState<TAuthConfig>()

  useEffect(() => {
    if(demoMode) return;

    const fetchConfig = async () => {

      const { data, error } = await getOpenIdConfiguration();
      if(data) {
        const config = {
          autoLogin: false,
          clientId: clientId,
          authorizationEndpoint: data.authorization_endpoint,
          logoutEndpoint: data.end_session_endpoint,
          tokenEndpoint: data.token_endpoint,
          redirectUri: window.location.protocol + "//" + window.location.host + "/",
          scope: data.scopes_supported.join(" "),
        } as TAuthConfig

        setAuthConfig(config);

        localStorage.setItem(StorageKey.OpenIdConfig, JSON.stringify(config))
      }

      if(error) {
        console.log(error)
      }
    }

    const existingAuthConfig = localStorage.getItem(StorageKey.OpenIdConfig);
    if(existingAuthConfig) {
      return setAuthConfig(JSON.parse(existingAuthConfig) as unknown as TAuthConfig)
    }

    fetchConfig().then(() => console.log("loaded auth config."))

  }, []);

  return demoMode ? children :
    authConfig ? (
        <AuthProvider authConfig={authConfig}>
          {children}
        </AuthProvider>
      )
      : (<Spinner className="flex flex-row justify-center align-middle my-12" />)
}