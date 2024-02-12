import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";
import { Endpoint } from "@/constants.ts";
export async function serverIsDown(signal?: AbortSignal): Promise<boolean> {

  const config = makeBaseRequest(Endpoint.HealthCheck, "GET", signal)

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => false });

  if(error) {
    console.log("Error while performing health check:", error);
  }

  return !data ?? true;
}
