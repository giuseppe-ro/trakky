import { Total } from '@/models/total';

export function calculateChange(current: number, previous: number) {
  if (previous === undefined || previous === 0) {
    return 0;
  }

  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
}

export function getPreviousYearPartialTotal(
  totalsPerYear: Total[],
  lastYearCurrentMonth: Date
) {
  return totalsPerYear
    .filter((total) => {
      if (total.date) {
        const totalDate = new Date(total.date);
        return (
          totalDate <= lastYearCurrentMonth &&
          totalDate.getFullYear() === lastYearCurrentMonth.getFullYear()
        );
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
  return totalsPerYear
    .filter((total) => {
      if (total.date) {
        const totalDate = new Date(total.date);
        return totalDate.getFullYear() === Number(selectedYear) - 1;
      }
      return false;
    })
    .map((total) => total.amount)
    .reduce((total, currentAmount) => total + currentAmount, 0);
}
