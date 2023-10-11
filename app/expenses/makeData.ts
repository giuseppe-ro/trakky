import {Payment} from './components/columns'
import {Summary} from "@/app/dashboard/components/overview";
import raw_data from "@/app/expenses/data.json";
import raw_budgets from "@/app/expenses/budgets.json";


const data: Payment[] = raw_data.map((payment) => {
    return {
        id: payment.id,
        amount: payment.amount,
        owner: payment.owner,
        description: payment.description,
        type: payment.type,
        date: new Date(payment.date),
    }
})

export function getAvailableYears(): string[] {
  const years = new Set(data.map((d) => d.date.getFullYear()))
  return Array.from(years).map((year) => year.toString()).sort().reverse()
}

export function getPayments(year: string): Payment[] {
    if (year === "All") {
        return data
    }
  return data.filter((d) => d.date.getFullYear() === parseInt(year))
}

export const getSummaries: Summary[] = data.reduce((summaries: Summary[], transaction) => {
  const year = transaction.date.getFullYear().toString();
  const index = parseInt(year);

  const budget = raw_budgets.filter(item => item.year === year)
      .reduce((sum, current) => sum + parseFloat(current.budget), 0);

  const maxBudget = raw_budgets.filter(item => item.year === year)
      .reduce((sum, current) => sum + parseFloat(current.maxBudget), 0);

  const existingYear = summaries.find(summaryItem => summaryItem.index === index);
  if (existingYear) {
    existingYear.total += parseFloat(transaction.amount);
  } else {
    summaries.push({
      index,
      name: year,
      total: parseFloat(transaction.amount),
      budget: budget,
      maxBudget: maxBudget
    });
  }

  return summaries;
}, []);

export function getMonthlySummaries(data: Payment[]): Summary[] {
    let result: Summary[] = [];

    const year = data[0].date.getFullYear().toString();

    for(const item of data) {
        const name: string = item.date.toLocaleString('en-GB', {month: 'short'});
        const index: number = item.date.getMonth()
        const existingItem: Summary | undefined = result.find(entry => entry.name === name);

        if (existingItem) {
            existingItem.total += parseInt(item.amount, 10);
        } else {
            const budget = raw_budgets.filter(item => item.year === year && item.month === name)
                .reduce((sum, current) => sum + parseFloat(current.budget), 0);

            const maxBudget = raw_budgets.filter(item => item.year === year && item.month === name)
                .reduce((sum, current) => sum + parseFloat(current.maxBudget), 0);

            result.push({index: index, name, total: parseInt(item.amount, 10), budget: budget, maxBudget: maxBudget});
        }
    }

    return result;
}

export function getAllSummaries({data, availableYears}: { data: Payment[], availableYears: string[] }): Summary[] {
    let allSummaries: Summary[] = [];

    allSummaries.push(...getSummaries);

    for(const year in availableYears) {
        for(const item of data) {
            const name: string = item.date.getFullYear().toString()
            const index: number = item.date.getFullYear()

            const existingItem: Summary | undefined = allSummaries.find(entry => entry.name === name);
            const budget = raw_budgets.filter(item => item.year === year)
                .reduce((sum, current) => sum + parseFloat(current.budget), 0);

            const maxBudget = raw_budgets.filter(item => item.year === year)
                .reduce((sum, current) => sum + parseFloat(current.maxBudget), 0);

            if (existingItem) {
                existingItem.total += parseInt(item.amount, 10);
                existingItem.budget += budget;
                existingItem.maxBudget += budget;
            } else {
                allSummaries.push({index: index, name, total: parseInt(item.amount, 10), budget: budget, maxBudget: maxBudget});
            }
        }
    }

    return allSummaries;
}