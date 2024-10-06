import { callApi, makeBaseRequest } from '@/infrastructure/remote/base';
import { Endpoint } from '@/constants';

interface HealthCheckResponse {
  message?: string;
}

async function serverIsDown(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.HealthCheck, 'GET', signal);

  const { data, error } = await callApi<HealthCheckResponse>({
    request: config,
  });

  return data?.message !== 'OK' || error !== null;
}

export default serverIsDown;
