import { useEffect, useState } from "react";
import { FetchPayments, Payment } from "@/infrastructure/payment.tsx";
import { getAvailableYears } from "@/lib/summaries.ts";
import { Budget, fetchBudgets } from "@/infrastructure/budget.tsx";

export function usePaymentData() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>("");

  async function refreshData(flushPaymentsBeforeRefresh: boolean = true) {
    if(flushPaymentsBeforeRefresh) setPayments([]);

    const data = await FetchPayments();
    setPayments(data);
    const years = getAvailableYears(data);
    years.push("All");
    setAvailableYears(years);

    const storedYear = localStorage.getItem("selected_year");
    if (storedYear && years.includes(storedYear)) {
      setSelectedYear(storedYear);
    } else {
      setSelectedYear(years[0]);
    }
  }

  useEffect(() => {
    refreshData().then(() => {
      console.log("Refreshed payments data");
    });
  }, []);

  return {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  };
}

export function useBudgetsData() {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  async function refreshData(flushBeforeRefresh: boolean = true) {
    if(flushBeforeRefresh) setBudgets([]);

    const data = await fetchBudgets();

    setBudgets(data);
  }

  useEffect(() => {
    refreshData().then(() => {
      console.log("Refreshed payments data.");
    });
  }, []);

  return {
    budgets: budgets,
    refreshData,
  };
}

