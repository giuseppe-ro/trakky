import { useEffect, useState } from 'react';
import { GetPayments } from '@/infrastructure/payment';
import { StorageKey } from '@/constants';
import { Payment } from '@/models/dtos';
import { getAvailableYears } from '@/components/summary/summaries';

function usePaymentData() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>('');

  async function refreshData(
    signal?: AbortSignal,
    flushPaymentsBeforeRefresh: boolean = true
  ) {
    if (flushPaymentsBeforeRefresh) setPayments([]);

    const data = await GetPayments(signal);
    setPayments(data);
    const years = getAvailableYears(data);
    years.push('All');
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
    const { signal } = controller;

    refreshData(signal).then(() => {});
  }, []);

  return {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  };
}

export default usePaymentData;
