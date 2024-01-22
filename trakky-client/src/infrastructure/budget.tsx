import { demoMode, serverUrl } from "@/constants.ts";
import { makeBudgets } from "@/lib/makeData.ts";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Budget {
  id: string;
  date: string;
  budget: number;
  maxBudget: number;
}

export async function fetchBudgets(): Promise<Budget[]> {
  if (demoMode) return makeBudgets();

  let response = await axios.get(`${serverUrl}/budgets`);
  return (await response.data)
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


export async function AddBudgets(budgets: Budget[]): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.post(`${serverUrl}/budgets`, budgets);
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

export async function EditBudget(budget: Budget): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.put(`${serverUrl}/budget`, budget);
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

export async function DeleteBudgets(ids: number[]): Promise<boolean> {
  if (demoMode) return true;

  try {
    const res = await axios.delete(`${serverUrl}/budgets`, {
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
