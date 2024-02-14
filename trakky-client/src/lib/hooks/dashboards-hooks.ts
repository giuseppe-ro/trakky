import { useEffect, useState } from 'react';
import {
  getExpensesBreakdown,
  getMonthlyOwnersSummariesForYear,
  getMonthlyPaymentsSummariesForYear,
  getYearlyOwnersSummaries,
  getYearlyPaymentsSummaries,
} from '@/lib/summaries';
import { getBudgets } from '@/infrastructure/budget';
import {
  OwnerOverview,
  PaymentOverview,
} from '@/app/dashboards/components/dashboards';
import { Budget, Payment } from '@/models/dtos';

export function useDashboards({
  data,
  selectedYear,
}: {
  data: Payment[] | null;
  selectedYear: string | null;
}) {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [filteredData, setFilteredData] = useState<Payment[] | null>(null);
  const [paymentOverviews, setPaymentOverviews] = useState<PaymentOverview[]>(
    []
  );
  const [ownersOverview, setOwnersOverview] = useState<OwnerOverview[]>([]);
  const [expensesBreakdown, setExpensesBreakdown] =
    useState<{ name: string; value: number }[]>();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      const { data: newData, error } = await getBudgets(signal);

      if (error) throw new Error(error.error);

      setBudgets(newData);
    };

    fetchData().then(() => {});
  }, []);

  useEffect(() => {
    if (selectedYear === 'All' && budgets && data) {
      setFilteredData(data);
      setExpensesBreakdown(getExpensesBreakdown(data));
      setPaymentOverviews(getYearlyPaymentsSummaries(data, budgets));
      setOwnersOverview(getYearlyOwnersSummaries(data));
    } else if (budgets && selectedYear !== null && data) {
      const filteredPayments = data.filter(
        (payment) =>
          new Date(payment.date).getFullYear() ===
          parseInt(selectedYear ?? '', 10)
      );
      setFilteredData(filteredPayments);
      setExpensesBreakdown(getExpensesBreakdown(filteredPayments));
      const budget = budgets.find(
        (item) => new Date(item.date).getFullYear().toString() === selectedYear
      );

      setOwnersOverview(getMonthlyOwnersSummariesForYear(filteredPayments));

      if (budget) {
        setPaymentOverviews(
          getMonthlyPaymentsSummariesForYear(filteredPayments, budget)
        );
      }
    } else {
      setFilteredData([]);
      setExpensesBreakdown([]);
    }
  }, [selectedYear, data, budgets]);

  return {
    filteredData,
    paymentOverviews,
    ownersOverview,
    expensesBreakdown,
  };
}

export default useDashboards;
