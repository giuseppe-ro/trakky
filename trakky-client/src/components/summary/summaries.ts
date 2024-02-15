import { PaymentOverview, OwnerOverview } from '@/components/dashboards/charts';
import { Payment, Budget } from '@/models/dtos';

export function getAvailableYears(data: Payment[]) {
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

export function getYearlyPaymentsSummaries(data: Payment[], budgets: Budget[]) {
  const hasMultipleMonths =
    new Set(data.map((payment) => new Date(payment.date).getMonth())).size > 1;

  return data.reduce((summaries: PaymentOverview[], transaction) => {
    const year = new Date(transaction.date).getFullYear();
    const month = new Date(transaction.date).getMonth();
    const index = year;

    const currentBudgets = budgets.reduce(
      (acc, current) => {
        if (
          new Date(current.date).getFullYear() === year &&
          (hasMultipleMonths || new Date(current.date).getMonth() === month)
        ) {
          return {
            budget: acc.budget + current.budget,
            maxBudget: acc.maxBudget + current.maxBudget,
          };
        }
        return acc;
      },
      { budget: 0, maxBudget: 0 }
    );

    const existingYear = summaries.find(
      (summaryItem) => summaryItem.index === index
    );
    if (existingYear) {
      existingYear.total += Math.round(transaction.amount);
    } else {
      summaries.push({
        index,
        name: year.toString(),
        total: Math.round(transaction.amount),
        budget: currentBudgets.budget,
        maxBudget: currentBudgets.maxBudget,
      });
    }

    return summaries;
  }, []);
}

export function getMonthlyPaymentsSummariesForYear(
  data: Payment[],
  budget: Budget
): PaymentOverview[] {
  return data.reduce((summaries: PaymentOverview[], transaction) => {
    const date = new Date(transaction.date);
    const index = date.getMonth();
    const name: string = date.toLocaleString('en-GB', { month: 'short' });

    const existingMonth = summaries.find(
      (summaryItem) => summaryItem.index === index
    );

    if (existingMonth) {
      existingMonth.total += Math.round(transaction.amount);
    } else {
      summaries.push({
        index,
        name,
        total: Math.round(transaction.amount),
        budget: budget.budget,
        maxBudget: budget.maxBudget,
      });
    }
    return summaries;
  }, []);
}

export function getMonthlyOwnersSummariesForYear(
  data: Payment[]
): OwnerOverview[] {
  return data.reduce((summaries: OwnerOverview[], transaction: Payment) => {
    const date = new Date(transaction.date);
    const index = date.getMonth();

    const name: string = date.toLocaleString('en-GB', { month: 'short' });

    const existingMonth = summaries.find(
      (summaryItem) => summaryItem.index === index
    );

    const amount = Math.round(transaction.amount);

    if (existingMonth) {
      if (existingMonth.owners[transaction.owner] !== undefined) {
        existingMonth.owners[transaction.owner] += amount;
      } else {
        existingMonth.owners[transaction.owner] = amount;
      }
    } else {
      summaries.push({
        index,
        name,
        owners: { [transaction.owner]: amount },
      });
    }
    return summaries;
  }, []);
}

export function getYearlyOwnersSummaries(data: Payment[]): OwnerOverview[] {
  return data.reduce((summaries: OwnerOverview[], transaction) => {
    const year = new Date(transaction.date).getFullYear();

    const existingYear = summaries.find(
      (summaryItem) => summaryItem.index === year
    );

    const amount = Math.round(transaction.amount);

    if (existingYear) {
      if (existingYear.owners[transaction.owner] !== undefined) {
        existingYear.owners[transaction.owner] += amount;
      } else {
        existingYear.owners[transaction.owner] = amount;
      }
    } else {
      summaries.push({
        index: year,
        name: year.toString(),
        owners: { [transaction.owner]: amount },
      });
    }

    return summaries;
  }, []);
}

export function getExpensesBreakdown(data: Payment[] | null) {
  if (data === null) return [];

  const types = data
    .map((item) => item.type)
    .filter((value, index, self) => self.indexOf(value) === index);

  const result = types.map((type) => {
    return {
      name: type,
      value: Math.round(
        data
          .filter((item) => item.type === type)
          .reduce((sum, current) => sum + current.amount, 0)
      ),
    };
  });

  return result;
}
