/* eslint-disable guard-for-in */

export function formatCurrency(total: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(total);
}

export function formatDateMonth(date: string): string {
  return new Date(date).toLocaleString('en-GB', { month: 'long' });
}

export function formatStringDate(date: string): string {
  return new Date(date).toLocaleString('en-GB', {
    dateStyle: 'short',
  });
}

export function isValidDate(date: unknown) {
  const timestamp = Date.parse(date as string);
  return !Number.isNaN(timestamp);
}

export function firstOfTheMonthDateString(date: Date): Date {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  return new Date(`${year}-${month}-01`);
}

const isDecember = (date: Date) => date.getMonth() + 1 === 12;

export function nextMonthDateString(date: Date): Date {
  let year = date.getFullYear();
  let month: string;

  if (isDecember(date)) {
    year += 1;
    month = '1';
  } else {
    month = (date.getMonth() + 2).toString().padStart(2, '0');
  }

  return new Date(`${year}-${month}-01`);
}

export function convertFilterDateFormat(date: string): string {
  const dateObj = new Date(date);
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

  return `-${month}-`;
}

export function getPercentageChangeText(
  change: number,
  selectedThisYear: boolean,
  lastYearCurrentMonth: Date,
  selectedMonth: string
): string {
  if (change === 0) {
    return '';
  }

  let changePercentage =
    change > 0
      ? `+${change}% from previous year`
      : `${change}% from previous year`;

  const monthIsSelected = selectedMonth !== 'All Months';

  if (selectedThisYear && !monthIsSelected) {
    const month = lastYearCurrentMonth.toLocaleString('default', {
      month: 'short',
    });

    changePercentage += ` (up to ${month})`;
  }

  return changePercentage;
}

export const monthNameToNumber = (monthName: string): number => {
  const monthsMap: { [key: string]: number } = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  return monthsMap[monthName];
};

/* eslint-disable no-restricted-syntax */
interface Dictionary<T> {
  [Key: string]: T;
}

interface Balance {
  amount: number;
}

interface OwedBalance extends Balance {
  to: string;
}

export interface DebitorBalance {
  name: string;
  owed: OwedBalance[];
}

export interface Share {
  amount: number;
  debitorBalances: DebitorBalance[];
}

export function allMatches<T>(dictionary: Dictionary<T>, value: T) {
  return Object.values(dictionary).every((e) => e === value);
}

export const getDebitorBalances = (balances: Dictionary<number>) => {
  const items = Object.keys(balances).map((key) => {
    return { owner: key, amount: balances[key] };
  });

  items.sort((a, b) => a.amount - b.amount).reverse();

  let total: number = 0;
  const creditors: Dictionary<number> = {};
  const debitors: Dictionary<number> = {};
  const debitorBalances: DebitorBalance[] = [];

  items.forEach((balance) => {
    total += balance.amount;
  });

  total = Math.floor(total);

  const share = Math.floor(total / items.length);

  items.forEach((balance) => {
    if (balance.amount > share) {
      creditors[balance.owner] = Math.floor(balance.amount) - share;
    }

    if (balance.amount < share) {
      debitors[balance.owner] = share - Math.floor(balance.amount);
    }
  });

  for (const debitor in debitors) {
    const debitorBalance: DebitorBalance = { name: debitor, owed: [] };

    while (debitors[debitor] > 1) {
      let debitPaid: number = 0;

      for (const creditor in creditors) {
        if (creditors[creditor] >= debitors[debitor]) {
          debitPaid = debitors[debitor];
          creditors[creditor] -= debitPaid;
        } else {
          debitPaid = creditors[creditor];
          creditors[creditor] = 0;
        }

        debitors[debitor] -= debitPaid;

        if (debitPaid === debitors[debitor]) {
          break;
        }

        if (debitPaid > 0) {
          debitorBalance.owed.push({ to: creditor, amount: debitPaid });
        }
      }
      debitorBalances.push(debitorBalance);
    }
  }

  return { amount: share, debitorBalances } as unknown as Share;
};
