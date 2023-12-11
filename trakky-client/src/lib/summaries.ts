import { OwnerOverview, PaymentOverview } from "@/app/dashboard/components/overviews.tsx";
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

export function getYearlyPaymentsSummaries(
  data: Payment[],
  budgets: Budget[],
): PaymentOverview[] {
  return data.reduce((summaries: PaymentOverview[], transaction) => {
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

export function getMonthlyPaymentsSummariesForYear(
  data: Payment[],
  budget: Budget,
): PaymentOverview[] {
  return data.reduce((summaries: PaymentOverview[], transaction) => {
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


export function getMonthlyOwnersSummariesForYear(
  data: Payment[],
): OwnerOverview[] {
  return data.reduce((summaries: OwnerOverview[], transaction: Payment) => {
    const date = new Date(transaction.date);
    const index = date.getMonth();

    const name: string = date.toLocaleString("en-GB", { month: "short" });

    const existingMonth = summaries.find(
      (summaryItem) => summaryItem.index === index,
    );

    const amount = Math.round(transaction.amount);

    if (existingMonth) {
      if(existingMonth.owners[transaction.owner] !== undefined) {
        existingMonth.owners[transaction.owner] += amount;
      } else {
        existingMonth.owners[transaction.owner] = amount;
      }
    } else {
      summaries.push({
        index,
        name,
        owners: {[transaction.owner]: amount},
      });
    }
    return summaries;
  }, []);
}


export function getYearlyOwnersSummaries(
  data: Payment[],
): OwnerOverview[] {
  return data.reduce((summaries: OwnerOverview[], transaction) => {
    const year = new Date(transaction.date).getFullYear();

    const existingYear = summaries.find(
      (summaryItem) => summaryItem.index === year,
    );

    const amount = Math.round(transaction.amount);

    if (existingYear) {
      if(existingYear.owners[transaction.owner] !== undefined) {
        existingYear.owners[transaction.owner] += amount;
      } else {
        existingYear.owners[transaction.owner] = amount;
      }
    } else {
      summaries.push({
        index: year,
        name: year.toString(),
        owners: {[transaction.owner]: amount},
      });
    }

    return summaries;
  }, []);
}

export function getExpensesBreakdown(
  data: Payment[] | null,
): { name: string; value: number }[] {

  if(data === null) return [];

  const types = data
    .map((item) => item.type)
    .filter((value, index, self) => self.indexOf(value) === index);

  const result = types
    .map((type) => {
      return { name: type, value: data.filter(item => item.type === type)
          .reduce((sum, current) => sum + current.amount, 0) } }
    );

  result.forEach((item) => {
    item.value = Math.round(item.value);
  } );

  return result;
}