import axios from 'axios';
import { baseApiCall } from '@/infrastructure/base-api';
import { openIdWellKnownUrl } from '@/authConfig';

axios.defaults.headers.post['Content-Type'] = 'application/json';

interface AuthConfig {
  authorization_endpoint: string;
  end_session_endpoint: string;
  token_endpoint: string;
  scopes_supported: string[];
}

export async function getOpenIdConfiguration(signal?: AbortSignal) {
  const config = {
    url: openIdWellKnownUrl,
    method: 'GET',
    signal,
    headers: {
      'content-type': 'application/json',
    },
  };

  const { data, error } = await baseApiCall<AuthConfig>({ request: config });

  return { data, error };
}

export default getOpenIdConfiguration;
