import { useEffect, useState } from 'react';
import { GetPayments } from '@/infrastructure/payment';
import { StorageKey } from '@/constants';
import { Payment } from '@/models/dtos';
import { getYearsAndMonths } from '@/components/summary/summaries';
import { Table } from '@tanstack/react-table';
import { useQuery } from 'react-query';

export function usePaymentData() {
  const { data, refetch, isLoading, isError, error } = useQuery(
    'payments',
    async ({ signal }) => {
      return GetPayments(signal);
    }
  );

  return {
    data: data?.data ?? [],
    refreshData: refetch,
    isLoading,
    isError,
    error,
  };
}

export const useYearSelection = ({
  payments,
  isLoading,
}: {
  payments: Payment[];
  isLoading: boolean;
}) => {
  const [availableYears, setAvailableYears] = useState<Map<string, string[]>>();
  const [selectedYear, setSelectedYear] = useState<string | null>('');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(
    'All Months'
  );

  useEffect(() => {
    if (payments && !isLoading) {
      const years = getYearsAndMonths(payments);

      setAvailableYears(years);

      const storedYear = localStorage.getItem(StorageKey.SelectedYear);
      // const storedMonth = localStorage.getItem(StorageKey.SelectedMonth);
      if (storedYear && storedYear in years) {
        setSelectedYear(storedYear);
      } else {
        setSelectedYear(Array.from(years.keys())[0]);
      }
    }
    setSelectedMonth('All Months');
  }, [payments, isLoading]);

  return {
    availableYears,
    selectedYear,
    setSelectedYear,
    setSelectedMonth,
    selectedMonth,
  };
};

export const useFilteredPayments = <TData>(table: Table<TData>) => {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  const filteredRowModel = table.getFilteredRowModel();

  useEffect(() => {
    const newFilteredPayments = filteredRowModel.rows.map(
      (row) =>
        ({
          id: row.getValue('date'),
          amount: row.getValue('amount'),
          type: row.getValue('type'),
          owner: row.getValue('owner'),
          description: row.getValue('description'),
          date: row.getValue('date'),
        }) as Payment
    );

    setFilteredPayments(newFilteredPayments);
  }, [filteredRowModel]);

  return filteredPayments;
};
