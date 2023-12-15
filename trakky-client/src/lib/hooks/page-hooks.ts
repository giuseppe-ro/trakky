import { useEffect, useState } from "react";
import { fetchPayments, Payment } from "@/infrastructure/payment.tsx";
import { getAvailableYears } from "@/lib/summaries.ts";

export function usePaymentData() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>("");

  async function refreshData(flushPaymentsBeforeRefresh: boolean = true) {
    if(flushPaymentsBeforeRefresh) setPayments([]);

    const data = await fetchPayments();
    setPayments(data);
    const years = getAvailableYears(data);
    years.push("All");
    setAvailableYears(years);
    setSelectedYear(years[0]);
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
