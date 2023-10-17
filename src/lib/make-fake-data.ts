import { faker } from "@faker-js/faker";
import { Payment } from "@/infrastructure/payment";
import {Budget} from "@/infrastructure/budget";

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPayment = (): Payment => {
  return {
    id: faker.number.int().toString(),
    amount: faker.number.float({ min: 1, max: 500 }),
    type: faker.finance.transactionType(),
    owner: faker.person.firstName(),
    description: faker.commerce.department(),
    date: faker.date.past({ years: 2 }),
  };
};

export function makePayments(...lens: number[]) {
  const makeDataLevel = (depth = 0): Payment[] => {
    const len = lens[depth]!;
    return range(len).map((): Payment => {
      return {
        ...newPayment(),
      };
    });
  };

  return makeDataLevel();
}

export const data = makePayments(1000);

const budgets = (): Budget[] => {
    const raw_budgets = data.reduce((acc: Budget[], payment) => {

        const year = payment.date.getFullYear().toString();

        const existingYear = acc.find(
            (summaryItem) => summaryItem.year === year,
        );

        if (existingYear) {
            existingYear.budget += Math.round(payment.amount / 12).toString();
        } else {
            acc.push({
                year: year,
                budget: Math.round(payment.amount).toString(),
                maxBudget: Math.round(payment.amount).toString(),
                date: payment.date.toString(),
                month: payment.date.getMonth().toString(),
            });
        }

        return acc;
    }, []);

    raw_budgets.forEach((budget) => {
        budget.budget = Math.round(parseInt(budget.budget) / 12).toString();
        budget.maxBudget = Math.round(parseInt(budget.maxBudget) / 12).toString();
    });

    return raw_budgets;
}

console.log(budgets)

