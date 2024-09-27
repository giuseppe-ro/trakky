import { mockCategories } from '@/lib/makeData';
import {
  baseApiCall,
  baseRequestData,
  makeBaseRequest,
} from '@/infrastructure/base-api';
import { Endpoint } from '@/constants';
import { Category } from '@/models/dtos';

export async function GetCategories(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Categories, 'GET');
  config.signal = signal;

  const { data, error } = await baseApiCall<Category[]>({
    request: config,
    demoModeData: mockCategories,
  });

  return { data: data ?? [], error };
}

export async function AddCategory(category: Category): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Categories, 'POST');

  config.data = baseRequestData(category);

  const { data } = await baseApiCall<boolean>({ request: config });

  // TODO: return error as well and handle
  return data ?? false;
}

export async function DeleteCategories(ids: number[]): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Categories, 'DELETE');
  config.data = baseRequestData(ids);

  const { data } = await baseApiCall<boolean>({ request: config });

  // TODO: return error as well and handle
  return data ?? false;
}
