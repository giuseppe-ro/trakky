import { makeTypes } from '@/lib/makeData';
import {
  baseApiCall,
  baseRequestData,
  makeBaseRequest,
} from '@/infrastructure/base-api';
import { Endpoint } from '@/constants';
import { Type } from '@/models/dtos';

export async function GetTypes(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Types, 'GET');
  config.signal = signal;

  const { data, error } = await baseApiCall<Type[]>({
    request: config,
    demoModeData: makeTypes,
  });

  return { data: data ?? [], error };
}

export async function AddTypes(types: Type[]): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Types, 'POST');
  config.data = baseRequestData(types);

  const { data } = await baseApiCall<boolean>({ request: config });

  // TODO: return error as well and handle
  return data ?? false;
}

export async function DeleteTypes(ids: number[]): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Types, 'DELETE');
  config.data = baseRequestData(ids);

  const { data } = await baseApiCall<boolean>({ request: config });

  // TODO: return error as well and handle
  return data ?? false;
}
