import { callApi, makeBaseRequest } from '@/infrastructure/remote/base';
import { Endpoint } from '@/constants';
import { Icon } from '@/models/dtos';

export default async function GetRemoteIcons() {
  const config = makeBaseRequest(Endpoint.Icons, 'GET');

  const { data, error } = await callApi<Icon[]>({
    request: config,
  });

  return { data: data ?? [], error };
}
