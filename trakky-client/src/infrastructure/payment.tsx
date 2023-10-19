export interface Payment {
  id: string;
  amount: number;
  type: string;
  owner: string;
  description: string;
  date: string;
}

export async function fetchPayments(): Promise<Payment[]> {
  let response = await fetch('http://0.0.0.0:8999/payments');
  let json: any = await response.json();
  return json as Payment[];
}