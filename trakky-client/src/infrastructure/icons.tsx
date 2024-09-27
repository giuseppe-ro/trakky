import { mockCategories } from '@/lib/makeData';
import { baseApiCall, makeBaseRequest } from '@/infrastructure/base-api';
import { Endpoint } from '@/constants';
import { Icon } from '@/models/dtos';

export default async function GetIcons(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Icons, 'GET');
  config.signal = signal;

  const { data, error } = await baseApiCall<Icon[]>({
    request: config,
    demoModeData: mockCategories,
  });

  return { data: data ?? [], error };
}
