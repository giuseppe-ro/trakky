import { useEffect, useState } from "react";
import { GetPayments, Payment } from "@/infrastructure/payment.tsx";
import { getAvailableYears } from "@/lib/summaries.ts";
import { Budget, getBudgets } from "@/infrastructure/budget.tsx";
import { StorageKey } from "@/constants.ts";

export function usePaymentData() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>("");

  async function refreshData(signal?: AbortSignal, flushPaymentsBeforeRefresh: boolean = true) {
    if(flushPaymentsBeforeRefresh) setPayments([]);

    const data = await GetPayments(signal);
    setPayments(data);
    const years = getAvailableYears(data);
    years.push("All");
    setAvailableYears(years);

    const storedYear = localStorage.getItem(StorageKey.SelectedYear);
    if (storedYear && years.includes(storedYear)) {
      setSelectedYear(storedYear);
    } else {
      setSelectedYear(years[0]);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

      refreshData(signal).then(() => {
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
  async function refreshData(flushBeforeRefresh: boolean = true, signal?: AbortSignal) {

    if(flushBeforeRefresh) setBudgets([]);

    const data = await getBudgets(signal);

    setBudgets(data);
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

      refreshData(true, signal).then (() => {

      });
  }, []);

  return {
    budgets: budgets,
    refreshData,
  };
}

