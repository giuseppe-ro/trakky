import { serverUrl } from "@/constants.ts";

export interface Payment {
  id: string;
  amount: number;
  type: string;
  owner: string;
  description: string;
  date: string;
}

export async function fetchPayments(): Promise<Payment[]> {
  let response = await fetch(`${serverUrl}/payments`);
  let json: any = await response.json();
  return json as Payment[];
}
