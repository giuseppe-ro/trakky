import { serverUrl, demoMode } from "@/constants.ts";
import { makeBudgets } from "@/lib/makeData.ts";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Budget {
  date: string;
  budget: string;
  maxBudget: string;
}

export async function fetchBudgets(): Promise<Budget[]> {
  if (demoMode) return makeBudgets();

  let response = await axios.get(`${serverUrl}/budgets`);
  return (await response.data) as Budget[];
}
