/* eslint-disable class-methods-use-this */
import BaseClient from '../client';
import { makeBaseRequest, callApi, baseRequestData } from './base';

export default class RemoteClient extends BaseClient {
  async Get(endpoint: string, signal?: AbortSignal) {
    const config = makeBaseRequest(endpoint, 'GET', signal);

    const { data: response, error } = await callApi({
      request: config,
    });

    return { data: response ?? [], error };
  }

  async Post<T>(endpoint: string, data: T, signal?: AbortSignal) {
    const config = makeBaseRequest(endpoint, 'POST', signal);

    config.data = baseRequestData(data);

    const { data: response, error } = await callApi<boolean>({
      request: config,
    });

    return { data: response ?? false, error };
  }

  async Upload(
    endpoint: string,
    file: File,
    signal?: AbortSignal
  ): Promise<null | string> {
    const config = makeBaseRequest(`${endpoint}/upload`, 'POST', signal);

    const formData = new FormData();
    formData.append('file', file);

    config.data = formData;

    if (config.headers) {
      config.headers['content-type'] = 'multipart/form-data';
    }

    const { data: response, error } = await callApi<boolean>({
      request: config,
    });

    return response ? null : error?.error ?? 'Unknown error';
  }

  async Put<T>(endpoint: string, data: T, signal?: AbortSignal) {
    const config = makeBaseRequest(endpoint, 'PUT', signal);
    config.data = baseRequestData(data);

    const { data: response, error } = await callApi<boolean>({
      request: config,
    });

    return { data: response ?? false, error };
  }

  async Delete(endpoint: string, ids: number[], signal?: AbortSignal) {
    const config = makeBaseRequest(endpoint, 'DELETE', signal);

    config.data = baseRequestData(ids);

    const { data: response, error } = await callApi<boolean>({
      request: config,
    });

    return { data: response ?? false, error };
  }
}
