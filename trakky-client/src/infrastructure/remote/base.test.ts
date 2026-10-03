import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  authHeaders,
  callApi,
  isUnauthorized,
  makeBaseRequest,
  statusOf,
} from './base';

const { axiosMock, getAccessTokenMock } = vi.hoisted(() => ({
  axiosMock: vi.fn(),
  getAccessTokenMock: vi.fn(),
}));

vi.mock('axios', () => ({
  default: Object.assign(axiosMock, {
    isAxiosError: (error: unknown) =>
      (error as { isAxiosError?: boolean })?.isAxiosError === true,
  }),
}));

vi.mock('@/auth/userManager', () => ({
  getAccessToken: getAccessTokenMock,
  getUserManager: vi.fn(),
}));

const axiosError = (status: number) =>
  Object.assign(new Error(`Request failed with status code ${status}`), {
    isAxiosError: true,
    response: { status, data: {} },
  });

describe('makeBaseRequest', () => {
  it('never sends a placeholder bearer token', () => {
    const config = makeBaseRequest('payments', 'GET');

    expect(config.headers?.Authorization).toBeUndefined();
    expect(config.url).toContain('/payments');
  });
});

describe('authHeaders', () => {
  it('adds a bearer header when there is a token', () => {
    expect(authHeaders('a-token')).toEqual({ Authorization: 'Bearer a-token' });
  });

  it('adds nothing when there is no token', () => {
    expect(authHeaders(null)).toEqual({});
    expect(authHeaders(undefined)).toEqual({});
  });
});

describe('isUnauthorized', () => {
  it('reads the status out of an axios error', () => {
    expect(statusOf(axiosError(401))).toBe(401);
    expect(isUnauthorized(statusOf(axiosError(401)))).toBe(true);
    expect(isUnauthorized(statusOf(axiosError(500)))).toBe(false);
  });

  it('treats non-axios failures as not unauthorized', () => {
    expect(statusOf(new Error('offline'))).toBeUndefined();
    expect(isUnauthorized(statusOf(new Error('offline')))).toBe(false);
  });
});

describe('callApi', () => {
  beforeEach(() => {
    axiosMock.mockReset();
    getAccessTokenMock.mockReset();
    getAccessTokenMock.mockResolvedValue('a-token');
  });

  it('attaches the access token to the outgoing request', async () => {
    axiosMock.mockResolvedValue({ data: 'ok' });

    await callApi({ request: makeBaseRequest('payments', 'GET') });

    const sent = axiosMock.mock.calls[0][0];
    expect(sent.headers.Authorization).toBe('Bearer a-token');
    expect(sent.headers['content-type']).toBe('application/json');
  });

  it('sends no authorization header when there is no token', async () => {
    getAccessTokenMock.mockResolvedValue(null);
    axiosMock.mockResolvedValue({ data: 'ok' });

    await callApi({ request: makeBaseRequest('payments', 'GET') });

    const sent = axiosMock.mock.calls[0][0];
    expect(sent.headers.Authorization).toBeUndefined();
  });

  it('retries once after a 401 and returns the retry result', async () => {
    axiosMock
      .mockRejectedValueOnce(axiosError(401))
      .mockResolvedValueOnce({ data: 'ok' });

    const { data, error } = await callApi<string>({
      request: makeBaseRequest('payments', 'GET'),
    });

    expect(axiosMock).toHaveBeenCalledTimes(2);
    expect(data).toBe('ok');
    expect(error).toBeNull();
  });

  it('does not retry more than once', async () => {
    axiosMock.mockRejectedValue(axiosError(401));

    const { data, error } = await callApi<string>({
      request: makeBaseRequest('payments', 'GET'),
    });

    expect(axiosMock).toHaveBeenCalledTimes(2);
    expect(data).toBeNull();
    expect(error?.error).toContain('401');
  });

  it('does not retry a server error', async () => {
    axiosMock.mockRejectedValue(axiosError(500));

    const { error } = await callApi<string>({
      request: makeBaseRequest('payments', 'GET'),
    });

    expect(axiosMock).toHaveBeenCalledTimes(1);
    expect(error?.error).toContain('500');
  });
});
