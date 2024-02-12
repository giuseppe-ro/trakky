import { makeBudgets } from "@/lib/makeData.ts";
import axios from "axios";
import { Endpoint } from "@/constants.ts";
import { baseApiCall, baseRequestData, makeBaseRequest } from "@/infrastructure/base-api.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Budget {
  id: string;
  date: string;
  budget: number;
  maxBudget: number;
}

export async function getBudgets(signal?: AbortSignal): Promise<Budget[]> {
  const config = makeBaseRequest(Endpoint.Budgets, "GET", signal);

  const { data, error } = await baseApiCall<Budget[]>({ request: config, demoModeData: makeBudgets });

  if (error) {
    console.log("Error while getting budgets:", error);
  }

  return data ?? [];
}


export async function AddBudgets(budgets: Budget[], signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Budgets, "POST", signal)
  config.data = baseRequestData(budgets);

  console.log("AddBudgets infrastructure: ", budgets)
  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  console.log("AddBudgets infrastructure: ", data, error)

  if (error) {
    console.log("Error while adding budgets:", error);
  }

  return { data: data ?? false, error };
}

export async function EditBudget(budget: Budget, signal?: AbortSignal) {
  console.log("EditBudget infrastructure: ", budget);
  const config = makeBaseRequest(Endpoint.Budgets, "PUT", signal)

  config.data = baseRequestData(budget);

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while editing budget:", error);
  }

  return { data: data ?? false, error };
}

export async function DeleteBudgets(ids: number[], signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Budgets, "DELETE", signal)
  config.data = baseRequestData(ids);

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while deleting budgets:", error);
  }

  return { data: data ?? false, error };
}
