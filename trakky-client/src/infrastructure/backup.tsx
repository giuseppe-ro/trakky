import axios from "axios";
import { Budget } from "@/infrastructure/budget.tsx";
import { Payment } from "@/infrastructure/payment.tsx";
import { Type } from "@/infrastructure/transaction-type.tsx";
import { Owner } from "@/infrastructure/owner.tsx";
import { BaseFetchResultHandler } from "@/infrastructure/base.tsx";
import { mockBackup } from "@/lib/makeData.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Backup {
  budgets: Budget[];
  payments: Payment[];
  types: Type[];
  owners: Owner[];
}

function mapBackup<T>(data: any): T[] {
  return [data] as T[];
}

export async function fetchBackup(): Promise<Backup> {
  return (await BaseFetchResultHandler<Backup>(mockBackup,"backup", mapBackup))[0];
}
