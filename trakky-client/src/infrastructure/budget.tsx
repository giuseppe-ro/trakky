import { makeBudgets } from "@/lib/makeData.ts";
import axios from "axios";
import {
  BaseFetchResultHandler,
  BaseResultHandler,
  HandleExceptionBoolean,
  HandleResponseBoolean
} from "@/infrastructure/base.tsx";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Budget {
  id: string;
  date: string;
  budget: number;
  maxBudget: number;
}

function mapBudgets<T>(data: any): T[] {
  return data
    .sort((p: Budget) => p.date)
    .reverse()
    .map((p: Budget) => {
      return {
        id: p.id,
        date: p.date,
        budget: p.budget,
        maxBudget: p.maxBudget,
      }
    });
}

export async function fetchBudgets(): Promise<Budget[]> {
  return await BaseFetchResultHandler<Budget>(makeBudgets, "budgets", mapBudgets);
}


export async function AddBudgets(budgets: Budget[]): Promise<boolean> {
  return await BaseResultHandler(axios.post, "budgets", budgets, HandleResponseBoolean, HandleExceptionBoolean, true);
}

export async function EditBudget(budget: Budget): Promise<boolean> {
  return await BaseResultHandler(axios.put, "budget", budget, HandleResponseBoolean, HandleExceptionBoolean, true);
}

export async function DeleteBudgets(ids: number[]): Promise<boolean> {
  return await BaseResultHandler(axios.delete, "budgets", {data: ids}, HandleResponseBoolean, HandleExceptionBoolean, true);
}
