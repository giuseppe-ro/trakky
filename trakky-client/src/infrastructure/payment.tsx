import { mockPayments } from "@/lib/makeData.ts";
import { Endpoint } from "@/constants.ts";
import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";


export interface Payment {
  id?: string;
  amount: number;
  type: string;
  owner: string;
  description: string;
  date: string;
}

export async function FetchPayments(): Promise<Payment[]> {
  const config = makeBaseRequest(Endpoint.Payments, "GET")

  const { data, error } = await baseApiCall<Payment[]>({ request: config, demoModeData: mockPayments });

  if (error) {
    console.log("Error while getting payments:", error);
  }

  return data ?? [];
}

export async function AddPayments(payments: Payment[]): Promise<boolean> {
  console.log("AddPayments", payments);
  const config = makeBaseRequest(Endpoint.Payments, "POST")

  config.data = payments;

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while editing payments:", error);
  }

  return data ?? false;
}

export async function UploadPayments(file: File): Promise<null | string> {

  const config = makeBaseRequest(`${Endpoint.Payments}/upload`, "POST")

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

export async function EditPayment(payment: Payment): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Payments, "PUT")
  config.data = payment;

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while editing payments:", error);
  }

  return data ?? false;
}

export async function DeletePayments(ids: number[]): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Payments, "DELETE")
  config.data = ids;

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while delete payments:", error);
  }

  return data ?? false;
}