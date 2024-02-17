import { Total } from '@/models/total';

export function calculatePercentageDiff(current: number, previous: number) {
  if (previous === undefined || previous === 0) {
    return 0;
  }

  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
}

export function getTotalForDate(totals: Total[], untilDate: Date) {
  const untilDateYear = untilDate.getFullYear();
  return totals
    .filter((total) => {
      if (total.date) {
        const date = new Date(total.date);
        return date <= untilDate && date.getFullYear() === untilDateYear;
      }
      return false;
    })
    .map((total) => total.amount)
    .reduce((total, currentAmount) => total + currentAmount, 0);
}

export function getPreviousYearTotal(
  totalsPerYear: Total[],
  selectedYear: string
) {
  const numericYear = Number(selectedYear) - 1;
  return totalsPerYear
    .filter((total) => {
      if (total.date) {
        const totalDate = new Date(total.date);
        return totalDate.getFullYear() === numericYear;
      }
      return false;
    })
    .map((total) => total.amount)
    .reduce((total, currentAmount) => total + currentAmount, 0);
}
