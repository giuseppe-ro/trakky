import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Summary } from "@/app/dashboard/components/overview";
import {Payment} from "@/infrastructure/payment";
import {Budget} from "@/infrastructure/budget";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(total: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(total);
}

export function formatDate(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  return `${parts[2].value}/${parts[0].value}/${parts[4].value}`;
}

export function getAvailableYears(data: Payment[]): string[] {
  return data
    .reduce((acc: number[], payment) => {
      const year = payment.date.getFullYear();
      if (!acc.includes(year)) {
        acc.push(year);
      }
      return acc;
    }, [])
    .sort((a, b) => b - a)
    .map((year) => year.toString());
}

export function getYearlySummaries(
  data: Payment[],
  budgets: Budget[],
): Summary[] {
  if(data.length === 0 || budgets.length === 0) return [];

  return data.reduce((summaries: Summary[], transaction) => {
    const year = transaction.date.getFullYear().toString();
    const index = parseInt(year);

    const budget = budgets
      .filter((item) => item.year === year)
      .reduce((sum, current) => sum + parseInt(current.budget), 0);

    const maxBudget = budgets
      .filter((item) => item.year === year)
      .reduce((sum, current) => sum + parseInt(current.maxBudget), 0);

    const existingYear = summaries.find(
      (summaryItem) => summaryItem.index === index,
    );
    if (existingYear) {
      existingYear.total += Math.round(transaction.amount);
    } else {
      summaries.push({
        index,
        name: year,
        total: Math.round(transaction.amount),
        budget: budget,
        maxBudget: maxBudget,
      });
    }

    return summaries;
  }, []);
}

export function getMonthlySummaries(
  data: Payment[],
  budgets: Budget[],
): Summary[] {

  if(data.length === 0) return [];

  let result: Summary[] = [];

  const year = data[0].date.getFullYear().toString();

  for (const item of data) {
    const date = item.date;
    const name: string = date.toLocaleString("en-GB", { month: "short" });
    const index: number = date.getMonth();
    const existingItem: Summary | undefined = result.find(
      (entry) => entry.name === name,
    );

    if (existingItem) {
      existingItem.total += Math.round(item.amount);
    } else {
      const budget = budgets
        .filter((item) => item.year === year && item.month === name)
        .reduce((sum, current) => sum + parseInt(current.budget), 0);

      const maxBudget = budgets
        .filter((item) => item.year === year && item.month === name)
        .reduce((sum, current) => sum + parseInt(current.maxBudget), 0);

      result.push({
        index: index,
        name,
        total: Math.round(item.amount),
        budget: budget,
        maxBudget: maxBudget,
      });
    }
  }

  return result;
}
