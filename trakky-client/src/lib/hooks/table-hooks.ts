'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { fuzzyFilter } from '@/lib/filters';
import {
  PaymentColumnDefinition,
  BudgetColumnDefinition,
} from '@/components/ui/table/columns';
import { toast } from '@/components/ui/use-toast';
import { demoMode, Endpoint } from '@/constants';
import * as z from 'zod';
import { Budget, Payment } from '@/models/dtos';
import { Total } from '@/models/total';
import { monthNameToNumber } from '@/lib/text-formatter';
import { Client } from '@/infrastructure/client-injector';

export function usePaymentsTable({
  data,
  selectedYear,
  selectedMonth,
  refreshData,
  isLoading,
}: {
  data: Payment[] | null;
  selectedYear: string | null;
  selectedMonth: string | null;
  refreshData(): void;
  isLoading: boolean;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filteredData, setFilteredData] = useState<Payment[]>([]);

  useEffect(() => {
    if (isLoading) return;

    if (selectedYear === 'All Years' && data) {
      setFilteredData(data);
      return;
    }

    if (data && selectedYear !== null && selectedMonth !== null) {
      const year = parseInt(selectedYear ?? '', 10);
      const month =
        selectedMonth === 'All Months' || selectedMonth === ''
          ? null
          : monthNameToNumber(selectedMonth);

      setFilteredData(
        data.filter((payment) => {
          const paymentYear = new Date(payment.date).getFullYear();
          if (month === null) {
            return paymentYear === year;
          }
          return (
            paymentYear === year &&
            new Date(payment.date).getMonth() + 1 === month
          );
        })
      );
    }
    // eslint-disable-next-line
  }, [selectedYear, selectedMonth, data]);

  const totalsPerYear =
    data === null
      ? []
      : data.reduce((acc: Total[], payment) => {
          const year = new Date(payment.date).getFullYear();
          const month = new Date(payment.date).getMonth();

          const existing = acc.find(
            (t) =>
              t.date?.getFullYear() === year && t.date?.getMonth() === month
          );
          if (existing) {
            existing.amount += payment.amount;
          } else {
            acc.push({
              amount: payment.amount,
              number: year,
              date: new Date(year, month),
            });
          }
          return acc;
        }, []);

  const columns = useMemo<ColumnDef<Payment, number | string>[]>(
    () => PaymentColumnDefinition(refreshData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    date: false,
    id: false,
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  async function onDeleteConfirmed(signal?: AbortSignal) {
    const ids = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id) as number[];

    const deleted = await Client.Delete(Endpoint.Payments, ids, signal);

    if (deleted) {
      refreshData();
      table.resetRowSelection();
      toast({
        title: 'Transactions deleted!',
        className: 'bg-green-600',
      });
    } else {
      toast({
        title: "Couldn't delete transactions!",
        className: 'bg-red-500',
      });
    }
  }

  async function onRefresh(resetFilters: boolean = true) {
    if (resetFilters) {
      table.resetColumnFilters();
      table.resetRowSelection();
    }

    refreshData();
  }

  function onEdited() {
    table.resetRowSelection();
    onRefresh(false).then(() => {});
  }

  return {
    totalsPerYear,
    table,
    onDeleteConfirmed,
    onPaymentEdited: onEdited,
    onRefresh,
  };
}

export function useBudgetsTable({
  data,
  refreshData,
}: {
  data: Budget[] | null;
  refreshData(flushBeforeRefresh?: boolean): void;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filteredData, setFilteredData] = useState<Budget[]>([]);

  const controller = new AbortController();
  const { signal } = controller;

  useEffect(() => {
    if (data !== null) {
      setFilteredData(data);
    }
  }, [data]);

  const columns = useMemo<ColumnDef<Budget, number | string>[]>(
    () => BudgetColumnDefinition(data, refreshData),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    date: true,
  });

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  async function onDeleteConfirmed() {
    const ids = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id) as number[];

    const deleted = await Client.Delete(Endpoint.Budgets, ids, signal);

    if (deleted) {
      refreshData(false);
      table.resetRowSelection();
      toast({
        title: 'Deleted!',
        className: 'bg-green-600',
      });
    } else {
      toast({
        title: "Couldn't delete!",
        className: 'bg-red-500',
      });
    }
  }

  async function onRefresh(flushBeforeRefresh: boolean = true) {
    table.resetColumnFilters();
    table.resetRowSelection();
    refreshData(flushBeforeRefresh);
  }

  function onEdited() {
    table.resetRowSelection();
    onRefresh(false).then(() => {});
  }

  return {
    table,
    onDeleteConfirmed,
    onBudgetEdited: onEdited,
    onRefresh,
  };
}

export async function onTransactionsUpload(
  file: File,
  signal?: AbortSignal,
  onRefresh?: (flushBeforeRefresh?: boolean) => void
): Promise<void> {
  if (demoMode) {
    toast({
      variant: 'warning',
      title: 'Transactions cannot be uploaded in demo mode!',
    });
    return;
  }
  const reader = new FileReader();

  const paymentsSchema = z.array(
    z.object({
      owner: z.string().min(1),
      type: z.string().min(1),
      date: z
        .string()
        .refine((val) => new Date(val) !== null, { message: 'invalid date' }),
      amount: z.number().refine((val) => val !== 0, {
        message: 'cannot be 0',
      }),
      description: z
        .string()
        .refine((val) => val.length <= 50 && val.length > 0),
    })
  );

  reader.onload = async (e) => {
    const result = e.target?.result;
    if (typeof result === 'string') {
      try {
        paymentsSchema.parse(JSON.parse(result));
      } catch (error) {
        if (error instanceof z.ZodError) {
          toast({
            variant: 'destructive',
            title: 'Invalid file format!',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Upload Failed!',
          });
        }
      }
    }
  };

  reader.readAsText(file);

  try {
    const uploadResult = await Client.Upload(Endpoint.Payments, file, signal);

    if (uploadResult === null) {
      toast({
        variant: 'success',
        description: 'Upload Successful!',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error!',
        description: uploadResult,
      });
    }
  } catch {
    toast({
      variant: 'destructive',
      title: 'Unknown Error.',
    });
  } finally {
    if (onRefresh) {
      onRefresh();
    }
  }
}
