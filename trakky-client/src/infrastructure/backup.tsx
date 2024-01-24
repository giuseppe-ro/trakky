import axios from "axios";
import { serverUrl } from "@/constants.ts";
import { Budget } from "@/infrastructure/budget.tsx";
import { Payment } from "@/infrastructure/payment.tsx";
import { Type } from "@/infrastructure/transaction-type.tsx";
import { Owner } from "@/infrastructure/owner.tsx";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Backup {
  budgets: Budget[];
  payments: Payment[];
  types: Type[];
  owners: Owner[];
}

export async function fetchBackup(): Promise<Backup> {
  let response = await axios.get(`${serverUrl}/backup`);
  return (await response.data) as Backup;
}
