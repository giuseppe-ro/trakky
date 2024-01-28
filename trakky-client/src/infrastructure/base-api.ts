import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "../models/api-response";
import { AppError } from "../models/app-error";
import { demoMode, serverUrl } from "@/constants.ts";
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export const makeBaseRequest = (endpoint: string, method: string): AxiosRequestConfig => {
  return {
    url: `${serverUrl}/${endpoint}`,
    method,
    headers: {
      "content-type": "application/json",
    },
  };
}

export const baseApiCall = async <T>(options: {
  request: AxiosRequestConfig;
  demoModeData?: () => T
}): Promise<ApiResponse<T>> => {
  if(demoMode && options.demoModeData) {
    return {
      data: options.demoModeData(),
      error: null,
    };
  }

  console.log("options", options)

  try {
    const response: AxiosResponse = await axios(options.request);
    console.log("response", response)
    const { data } = response;

    return {
      data: data as T,
      error: null,
    };
  } catch (error) {
    console.log("error", error)

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("axiosError", axiosError)

      const { response } = axiosError;

      let message: string;

      if (response && response.data && (response.data as AppError).error) {
        message = (response.data as AppError).error;
      } else if (axiosError.message) {
        message = axiosError.message;
      } else if (response && response.statusText) {
        message = response.statusText;
      } else {
        message = "Could not connect to the server.";
      }

      return {
        data: null,
        error: {
          error: message,
        },
      };
    }

    return {
      data: null,
      error: {
        error: (error as Error).message,
      },
    };
  }
};
