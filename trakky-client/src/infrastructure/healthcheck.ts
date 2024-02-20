import { baseApiCall, makeBaseRequest } from '@/infrastructure/base-api';
import { Endpoint } from '@/constants';

interface HealthCheckResponse {
  message?: string;
}

async function serverIsDown(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.HealthCheck, 'GET', signal);

  const { data, error } = await baseApiCall<HealthCheckResponse>({
    request: config,
    demoModeData: () => ({ message: 'OK' }),
  });

  return data?.message !== 'OK' || error !== null;
}

export default serverIsDown;
