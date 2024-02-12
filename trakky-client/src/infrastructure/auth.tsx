import axios from "axios";
import { baseApiCall } from "@/infrastructure/base-api.ts";
import { openIdWellKnownUrl } from "@/authConfig.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

interface AuthConfig {
  authorization_endpoint: string,
  end_session_endpoint: string,
  token_endpoint: string,
  scopes_supported: string[]
}


export async function getOpenIdConfiguration(signal?: AbortSignal) {
  const config = {
    url: openIdWellKnownUrl,
    method: "GET",
    signal,
    headers: {
      "content-type": "application/json",
    },
  };

  const { data, error } = await baseApiCall<AuthConfig>({ request: config });

  if (error) {
    console.log("Error while getting backup:", error);
  }

  if (data) {
    console.log("AUTH DATA:", data);
  }

  return { data: data, error: error };
}
