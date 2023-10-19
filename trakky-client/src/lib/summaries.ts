import { Summary } from "@/app/dashboard/components/overview";
import { Budget } from "@/infrastructure/budget";
import { Payment } from "@/infrastructure/payment";

export function getAvailableYears(data: Payment[]): string[] {
  return data
    .reduce((acc: number[], payment) => {
      const year = new Date(payment.date).getFullYear();
      if (!acc.includes(year)) {
        acc.push(year);
      }
      return acc;
    }, [])
    .sort((a, b) => b - a)
    .map((year) => year?.toString());
}

export function getYearlySummaries(
  data: Payment[],
  budgets: Budget[],
): Summary[] {
  return data.reduce((summaries: Summary[], transaction) => {
    const year = new Date(transaction.date).getFullYear();
    const index = year;

    const budget = budgets
      .filter((item) => new Date(item.date).getFullYear() === year)
      .reduce((sum, current) => sum + parseInt(current.budget), 0);

    const maxBudget = budgets
      .filter((item) => new Date(item.date).getFullYear() === year)
      .reduce((sum, current) => sum + parseInt(current.maxBudget), 0);

    const existingYear = summaries.find(
      (summaryItem) => summaryItem.index === index,
    );
    if (existingYear) {
      existingYear.total += Math.round(transaction.amount);
    } else {
      summaries.push({
        index,
        name: year.toString(),
        total: Math.round(transaction.amount),
        budget: budget,
        maxBudget: maxBudget,
      });
    }

    return summaries;
  }, []);
}

export function getMonthlySummariesForYear(
  data: Payment[],
  budget: Budget,
): Summary[] {
  return data.reduce((summaries: Summary[], transaction) => {
    const date = new Date(transaction.date);
    const index = date.getMonth();
    const name: string = date.toLocaleString("en-GB", { month: "short" });

    const existingMonth = summaries.find(
      (summaryItem) => summaryItem.index === index,
    );

    if (existingMonth) {
      existingMonth.total += Math.round(transaction.amount);
    } else {
      summaries.push({
        index,
        name,
        total: Math.round(transaction.amount),
        budget: parseInt(budget.budget),
        maxBudget: parseInt(budget.maxBudget),
      });
    }
    return summaries;
  }, []);
}
