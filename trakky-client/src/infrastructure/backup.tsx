import axios from "axios";
import { Budget } from "@/infrastructure/budget.tsx";
import { Payment } from "@/infrastructure/payment.tsx";
import { Type } from "@/infrastructure/transaction-type.tsx";
import { Owner } from "@/infrastructure/owner.tsx";
import { mockBackup } from "@/lib/makeData.ts";
import { Endpoint } from "@/constants.ts";
import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Backup {
  budgets: Budget[];
  payments: Payment[];
  types: Type[];
  owners: Owner[];
}


export async function fetchBackup(signal?: AbortSignal): Promise<Backup | null> {
  const config = makeBaseRequest(Endpoint.Backup, "GET", signal)

  const { data, error } = await baseApiCall<Backup>({ request: config, demoModeData: mockBackup });

  if (error) {
    console.log("Error while getting backup:", error);
  }

  return data ?? null;
}
