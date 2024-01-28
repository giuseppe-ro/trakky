export function formatCurrency(total: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(total);
}

export function formatDateMonth(date: Date): string {
  return new Date(date).toLocaleString('en-GB', {month: 'long' });
}

export function formatStringDate(date: string): string {
  return new Date(date).toLocaleString("en-GB", {
    dateStyle: "short",
  });
}

export function isValidDate(date: string) {
  return !isNaN(Date.parse(date));
}

export function firstOfTheMonthDateString(date: Date): Date {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  return new Date(`${year}-${month}-01`)
}

export function convertFilterDateFormat(date: string): string {
  const dateObj = new Date(date);
  // const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

  return `-${month}`;
}


export function getPercentageChangeText(change: number, selectedThisYear: boolean, selectedYear: string, lastYearCurrentMonth: Date): string {
  if (change === 0) {
    return ""
  }

  let changePercentage = change > 0
    ? `+${change}% from previous year`
    : `${change}% from previous year`;

  if (selectedThisYear) {
    const month = lastYearCurrentMonth.toLocaleString('default', { month: 'short' });
    const year = lastYearCurrentMonth.getFullYear();
    changePercentage += ` (up to ${month} ${year})`;
  } else {
    changePercentage += ` (${parseInt(selectedYear) - 1})`;
  }

  return changePercentage;
}
