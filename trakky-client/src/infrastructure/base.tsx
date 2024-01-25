import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { demoMode, serverUrl } from "@/constants.ts";

import axiosRetry from 'axios-retry';
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

axios.defaults.headers.post["Content-Type"] = "application/json";


export async function BaseFetchHandler(endpoint: string): Promise<AxiosResponse<any>> {
  return await axios.get(`${serverUrl}/${endpoint}`);
}

export async function BaseFetchResultHandler<T>(
  demoModeFunc: () => T[],
  endpoint: string,
  mapper?: (p: any) => T[]
): Promise<T[]> {
  if (demoMode)
    return demoModeFunc();

  try {
    let response = await BaseFetchHandler(endpoint);
    const data = (await response.data);

    if(mapper) {
      return mapper(data);
    }

    return data;

  } catch (e) {
    console.log(e);
  }

  return [];
}

export async function BaseResultHandler<TReturn>(
  apiFunc: (<T = any, R = AxiosResponse<T, any>, D = any>(url: string, data?: D | undefined, config?: AxiosRequestConfig<D> | undefined) => Promise<R>)
        |  (<T = any, R = AxiosResponse<T, any>, D = any>(url: string, config?: AxiosRequestConfig<D> | undefined) => Promise<R>),
  endpoint: string,
  data: any,
  successHandler: ((res: AxiosResponse<any, any>, errorHandler: (e: any) => TReturn) => TReturn),
  errorHandler: (e: any) => TReturn,
  demoModeReturnValue: TReturn,
  config?: any
): Promise<TReturn> {
  if (demoMode) return demoModeReturnValue;

  try {
    const res = await apiFunc(
      `${serverUrl}/${endpoint}`, data,config);

    console.log("Base Handler Res:", res);

    return successHandler(res, errorHandler);

  } catch (e) {
    console.log(e);
    return errorHandler(e);
  }
}

export function HandleExceptionMessage(err: any): string {
  if (err.code === "ERR_NETWORK") {
    return "The server is down or not reachable.";
  }

  if (err.response.data?.error) {
    console.log("data:", err.response.data.error);
    return err.response.data.error;
  }

  if (err.response.data) {
    console.log("data:", err.response.data);
    return err.response.data;
  }

  return HandleDefaultExceptionMessage(err);
}

export function HandleDefaultExceptionMessage(err: any): string {
  console.log(err);

  return "An error occurred. Please try again later.";
}

export function HandleExceptionBoolean(e: any): boolean {
  console.log(e);
  return false;
}

export function HandleResponseMessage(
  res: AxiosResponse<any, any>,
  errorHandler: (e: any) => string | null
): null | string {
  if (res.status === 200) {
    return null;
  }

  console.log(res);
  return errorHandler(res);
}

export function HandleResponseBoolean(
  res: AxiosResponse<any, any>,
  errorHandler: (e: any) => boolean
): boolean {
  if (res.status === 200) {
    return true;
  }

  return errorHandler(res);
}