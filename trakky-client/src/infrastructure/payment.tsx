import axios from "axios";
import { mockPayments } from "@/lib/makeData.ts";
import {
  BaseFetchResultHandler,
  BaseResultHandler, HandleExceptionBoolean,
  HandleExceptionMessage,
  HandleResponseBoolean,
  HandleResponseMessage
} from "@/infrastructure/base.tsx";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Payment {
  id: string;
  amount: number;
  type: string;
  owner: string;
  description: string;
  date: string;
}

function mapPayments<T>(data: any): T[] {
  return data.sort((p: any) => p.date)
    .map((p: Payment) => {
      return {
        id: p.id,
        amount: p.amount,
        type: p.type,
        owner: p.owner,
        description: p.description,
        date: p.date
      }
    })
}

export async function FetchPayments(): Promise<Payment[]> {
  return await BaseFetchResultHandler<Payment>(mockPayments, "payments", mapPayments);
}

export async function AddPayments(payments: Payment[]): Promise<boolean> {
  return await BaseResultHandler(axios.post, "payments", payments, HandleResponseBoolean, HandleExceptionBoolean, true)
}

export async function UploadPayments(file: File): Promise<null | string> {

  const formData = new FormData();
  formData.append("file", file);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }

  return await BaseResultHandler(axios.post, "upload/payments", formData, HandleResponseMessage, HandleExceptionMessage, null, config)
}

export async function EditPayment(payment: Payment): Promise<boolean> {
  return await BaseResultHandler(axios.put, "payment", payment, HandleResponseBoolean, HandleExceptionBoolean, true);
}

export async function DeletePayments(ids: number[]): Promise<boolean> {
  return await BaseResultHandler(axios.delete, "payments", {data: ids}, HandleResponseBoolean, HandleExceptionBoolean, true);
}
