import { mockPayments } from "@/lib/makeData.ts";
import { Endpoint } from "@/constants.ts";
import { baseApiCall, baseRequestData, makeBaseRequest } from "@/infrastructure/base-api.ts";


export interface Payment {
  id?: string;
  amount: number;
  type: string;
  owner: string;
  description: string;
  date: string;
}

export async function GetPayments(signal?: AbortSignal): Promise<Payment[]> {
  const config = makeBaseRequest(Endpoint.Payments, "GET", signal)

  const { data, error } = await baseApiCall<Payment[]>({ request: config, demoModeData: mockPayments });

  if (error) {
    console.log("Error while getting payments:", error);
  }

  return data ?? [];
}

export async function AddPayments(payments: Payment[], signal?: AbortSignal) {
  console.log("AddPayments", payments);
  const config = makeBaseRequest(Endpoint.Payments, "POST", signal)

  config.data = baseRequestData(payments);

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while editing payments:", error);
  }

  return { data: data ?? false, error };
}

export async function UploadPayments(file: File, signal?: AbortSignal): Promise<null | string> {

  const config = makeBaseRequest(`${Endpoint.Payments}/upload`, "POST", signal)

  const formData = new FormData();
  formData.append("file", file);

  config.data = formData;

  if (config.headers) {
    config.headers["content-type"] = "multipart/form-data";
  }

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while uploading payments:", error);
  }

  return data ? null : error?.error ?? "Unknown error";
}

export async function EditPayment(payment: Payment, signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Payments, "PUT", signal)
  config.data = baseRequestData(payment);

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while editing payments:", error);
  }

  return { data: data ?? false, error };
}

export async function DeletePayments(ids: number[], signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Payments, "DELETE", signal)

  config.data = baseRequestData(ids);

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while delete payments:", error);
  }

  return { data: data ?? false, error };
}