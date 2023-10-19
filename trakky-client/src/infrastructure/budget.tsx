export interface Budget {
  date: string;
  budget: string;
  maxBudget: string;
}

export async function fetchBudgets(): Promise<Budget[]> {
  let response = await fetch(`${serverUrl}/budgets`);
  let json: any = await response.json();
  return json as Budget[];
}
