import { mockPayments } from '@/lib/makeData';
import { Endpoint } from '@/constants';
import {
  baseApiCall,
  baseRequestData,
  makeBaseRequest,
} from '@/infrastructure/base-api';
import { Payment } from '@/models/dtos';

export async function GetPayments(signal?: AbortSignal): Promise<Payment[]> {
  const config = makeBaseRequest(Endpoint.Payments, 'GET', signal);

  const { data } = await baseApiCall<Payment[]>({
    request: config,
    demoModeData: mockPayments,
  });

  // TODO: return data and error & handle
  return data ?? [];
}

export async function AddPayments(payments: Payment[], signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Payments, 'POST', signal);

  config.data = baseRequestData(payments);

  const { data, error } = await baseApiCall<boolean>({
    request: config,
    demoModeData: () => true,
  });

  return { data: data ?? false, error };
}

export async function UploadPayments(
  file: File,
  signal?: AbortSignal
): Promise<null | string> {
  const config = makeBaseRequest(`${Endpoint.Payments}/upload`, 'POST', signal);

  const formData = new FormData();
  formData.append('file', file);

  config.data = formData;

  if (config.headers) {
    config.headers['content-type'] = 'multipart/form-data';
  }

  const { data, error } = await baseApiCall<boolean>({
    request: config,
    demoModeData: () => true,
  });

  return data ? null : error?.error ?? 'Unknown error';
}

export async function EditPayment(payment: Payment, signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Payments, 'PUT', signal);
  config.data = baseRequestData(payment);

  const { data, error } = await baseApiCall<boolean>({
    request: config,
    demoModeData: () => true,
  });

  return { data: data ?? false, error };
}

export async function DeletePayments(ids: number[], signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Payments, 'DELETE', signal);

  config.data = baseRequestData(ids);

  const { data, error } = await baseApiCall<boolean>({
    request: config,
    demoModeData: () => true,
  });

  return { data: data ?? false, error };
}
