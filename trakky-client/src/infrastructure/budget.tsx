import { makeBudgets } from "@/lib/makeData.ts";
import axios from "axios";
import { Endpoint } from "@/constants.ts";
import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Budget {
  id: string;
  date: string;
  budget: number;
  maxBudget: number;
}

export async function fetchBudgets(): Promise<Budget[]> {
  const config = makeBaseRequest(Endpoint.Budgets, "GET")

  const { data, error } = await baseApiCall<Budget[]>({ request: config, demoModeData: makeBudgets });

  if (error) {
    console.log("Error while getting budgets:", error);
  }

  return data ?? [];

}


export async function AddBudgets(budgets: Budget[]): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Budgets, "POST")
  config.data = budgets;

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while adding budgets:", error);
  }

  return data ?? false;
}

export async function EditBudget(budget: Budget): Promise<boolean> {
  console.log("EditBudget infrastructure: ", budget);
  const config = makeBaseRequest(Endpoint.Budgets, "PUT")
  config.data = budget;

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while editing budget:", error);
  }

  return data ?? false;
}

export async function DeleteBudgets(ids: number[]): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Budgets, "DELETE")
  config.data = ids;

  const { data, error } = await baseApiCall<boolean>({ request: config, demoModeData: () => true });

  if (error) {
    console.log("Error while deleting budgets:", error);
  }

  return data ?? false;
}
