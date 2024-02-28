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

export function nextMonthDateString(date: Date): Date {
  const year = date.getFullYear();
  const month = (date.getMonth() + 2).toString().padStart(2, '0');

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
  selectedYear: string,
  lastYearCurrentMonth: Date
): string {
  if (change === 0) {
    return '';
  }

  let changePercentage =
    change > 0
      ? `+${change}% from previous year`
      : `${change}% from previous year`;

  if (selectedThisYear) {
    const month = lastYearCurrentMonth.toLocaleString('default', {
      month: 'short',
    });
    const year = lastYearCurrentMonth.getFullYear();
    changePercentage += ` (up to ${month} ${year})`;
  } else {
    changePercentage += ` (${parseInt(selectedYear, 10) - 1})`;
  }

  return changePercentage;
}

export function getPercentageChangeText2(change: number): string {
  if (change === 0) {
    return '';
  }

  return change > 0
    ? `+${change}% from previous year`
    : `${change}% from previous year`;
}

export const differenceText = (
  partialTot: number,
  ownerBalancesLenght: number,
  amount: number
) => {
  const diff = Math.floor(partialTot / ownerBalancesLenght - amount);

  if (diff === 0 || diff < 0) return 0;
  if (diff === Number.POSITIVE_INFINITY || diff === Number.NEGATIVE_INFINITY)
    return 0;
  return partialTot / ownerBalancesLenght - amount;
};

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
