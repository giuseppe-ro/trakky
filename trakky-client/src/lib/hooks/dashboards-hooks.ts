import { useEffect, useState } from "react";
import { Payment } from "@/infrastructure/payment.tsx";
import {
  getExpensesBreakdown, getMonthlyOwnersSummariesForYear,
  getMonthlyPaymentsSummariesForYear, getYearlyOwnersSummaries,
  getYearlyPaymentsSummaries
} from "@/lib/summaries.ts";
import { Budget, fetchBudgets } from "@/infrastructure/budget.tsx";
import { OwnerOverview, PaymentOverview } from "@/app/dashboard/components/dashboards.tsx";

export function useDashboards({data, selectedYear}: {data: Payment[] | null, selectedYear: string | null}) {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [filteredData, setFilteredData] = useState<Payment[] | null>(null);
  const [paymentOverviews, setPaymentOverviews] = useState<PaymentOverview[]>([]);
  const [ownersOverview, setOwnersOverview] = useState<OwnerOverview[]>([]);
  const [expensesBreakdown, setExpensesBreakdown] = useState<any[]>()


  useEffect(() => {
    fetchBudgets().then((data) => {
      setBudgets(data);
    });
  }, []);

  useEffect(() => {
    if (
      selectedYear === "All" &&
      budgets &&
      data
    ) {
      setFilteredData(data);
      setExpensesBreakdown(getExpensesBreakdown(data));
      setPaymentOverviews(getYearlyPaymentsSummaries(data, budgets));
      setOwnersOverview(getYearlyOwnersSummaries(data));
    } else if (
      budgets &&
      selectedYear !== null &&
      data
    ) {
      const filteredPayments = data.filter(
        (payment) =>
          new Date(payment.date).getFullYear() ===
          parseInt(selectedYear ?? ""),
      );
      setFilteredData(filteredPayments);
      setExpensesBreakdown(getExpensesBreakdown(filteredPayments));
      const budget = budgets.find(
        (item) =>
          new Date(item.date).getFullYear().toString() ===
          selectedYear,
      );

      setOwnersOverview(getMonthlyOwnersSummariesForYear(filteredPayments));

      if (budget) {
        setPaymentOverviews(getMonthlyPaymentsSummariesForYear(filteredPayments, budget));
      }
    } else {
      setFilteredData([]);
      setExpensesBreakdown([]);
    }

  }, [selectedYear, data]);

  return {
    filteredData,
    paymentOverviews,
    ownersOverview,
    expensesBreakdown
  };
}
