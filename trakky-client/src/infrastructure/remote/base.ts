import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { serverUrl } from '@/authConfig';
import { getAccessToken } from '@/auth/userManager';
import { ApiResponse } from '@/models/api-response';
import { AppError } from '@/models/app-error';

export enum ErrorMessage {
  NO_CONNECTION = 'Could not connect to the server.',
  UNAUTHORIZED = 'Unauthorized.',
  FORBIDDEN = 'Forbidden.',
  NOT_FOUND = 'This page does not exist!',
  INTERNAL_SERVER_ERROR = 'Internal server error.',
  BAD_REQUEST = 'Bad request.',
  UNKNOWN_ERROR = 'An unknown error occurred.',
  FAILED_AUTHENTICATION = 'Unable to authenticate.',
}

export const makeBaseRequest = (
  endpoint: string,
  method: string,
  signal?: AbortSignal
): AxiosRequestConfig => {
  return {
    url: `${serverUrl}/${endpoint}`,
    method,
    signal,
    headers: {
      'content-type': 'application/json',
    },
  };
};

export const authHeaders = (token?: string | null): Record<string, string> => {
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const statusOf = (error: unknown): number | undefined => {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
};

export const isUnauthorized = (status?: number): boolean => status === 401;

const send = async (request: AxiosRequestConfig): Promise<AxiosResponse> => {
  const token = await getAccessToken();

  return axios({
    ...request,
    headers: { ...request.headers, ...authHeaders(token) },
  });
};

const toErrorResponse = <T>(error: unknown): ApiResponse<T> => {
  if (axios.isAxiosError(error)) {
    const { response } = error as AxiosError;

    let message: string;

    if (response && response.data && (response.data as AppError).error) {
      message = (response.data as AppError).error;
    } else if (error.message) {
      message = error.message;
    } else if (response && response.statusText) {
      message = response.statusText;
    } else {
      message = ErrorMessage.NO_CONNECTION;
    }

    return { data: null, error: { error: message } };
  }

  return { data: null, error: { error: (error as Error).message } };
};

export const callApi = async <T>(options: {
  request: AxiosRequestConfig;
}): Promise<ApiResponse<T>> => {
  try {
    const response = await send(options.request);

    return {
      data: response.data as T,
      error: null,
    };
  } catch (error) {
    if (isUnauthorized(statusOf(error))) {
      try {
        const retry = await send(options.request);

        return {
          data: retry.data as T,
          error: null,
        };
      } catch (retryError) {
        return toErrorResponse<T>(retryError);
      }
    }

    return toErrorResponse<T>(error);
  }
};

export const baseRequestData = <T>(data: T) => {
  return {
    data,
  };
};
