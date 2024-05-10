import { Total } from '@/models/total';

export function calculatePercentageDiff(current: number, previous: number) {
  if (previous === undefined || previous === 0) {
    return 0;
  }

  return Math.round(((current - previous) / previous) * 100 * 100) / 100;
}

export function getTotalForDate(
  totals: Total[],
  untilDate: Date,
  selectedMonth: number
) {
  const untilDateYear = untilDate.getFullYear();
  return totals
    .filter((total) => {
      if (total.date) {
        const date = new Date(total.date);
        const monthIsNotValid = selectedMonth === 0;

        if (monthIsNotValid) {
          return date <= untilDate && date.getFullYear() === untilDateYear;
        }

        return (
          date <= untilDate &&
          date.getFullYear() === untilDateYear &&
          date.getMonth() + 1 === selectedMonth
        );
      }
      return false;
    })
    .map((total) => total.amount)
    .reduce((total, currentAmount) => total + currentAmount, 0);
}

export function getPreviousYearTotal(
  totalsPerYear: Total[],
  selectedYear: string,
  selectedMonth: number
) {
  const numericYear = Number(selectedYear) - 1;
  return totalsPerYear
    .filter((total) => {
      const monthIsNotValid = selectedMonth === 0;

      if (total.date) {
        const totalDate = new Date(total.date);

        if (monthIsNotValid) {
          return totalDate.getFullYear() === numericYear;
        }

        return (
          totalDate.getFullYear() === numericYear &&
          totalDate.getMonth() + 1 === selectedMonth
        );
      }
      return false;
    })
    .map((total) => total.amount)
    .reduce((total, currentAmount) => total + currentAmount, 0);
}
