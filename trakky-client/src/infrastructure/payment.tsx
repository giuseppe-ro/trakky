import { serverUrl, demoMode } from "@/constants.ts";
import axios from "axios";
import { mockPayments } from "@/lib/makeData.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Payment {
  id: string;
  amount: number;
  type: string;
  owner: string;
  description: string;
  date: string;
}

export async function fetchPayments(): Promise<Payment[]> {
  if (demoMode)
    return mockPayments()
      .sort((p: any) => p.date)
      .map((p: Payment) => {
        return {
          id: p.id,
          amount: p.amount,
          type: p.type,
          owner: p.owner,
          description: p.description,
          date: p.date
        }
      });

  let response = await axios.get(`${serverUrl}/payments`);

  return (await response.data)
    .sort((p: Payment) => p.date)
    .map((p: Payment) => {
      return {
        id: p.id,
        amount: p.amount,
        type: p.type,
        owner: p.owner,
        description: p.description,
        date: p.date
      }
    });
}

export async function AddPayments(payments: Payment[]): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.post(`${serverUrl}/payments`, payments);
    if (res.status === 200) {
      return true;
    } else {
      console.log(res);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function EditPayment(payment: Payment): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.put(`${serverUrl}/payment`, payment);
    if (res.status === 200) {
      return true;
    } else {
      console.log(res);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function DeletePayments(ids: number[]): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.delete(`${serverUrl}/payments`, {
      data: ids,
    });

    if (res.status === 200) {
      return true;
    } else {
      console.log(res);
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}
