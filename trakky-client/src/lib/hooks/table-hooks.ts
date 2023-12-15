"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel, Table,
  useReactTable, VisibilityState
} from "@tanstack/react-table";

import { Total } from "@/app/expenses/components/summary.tsx";
import { DeletePayments, Payment } from "@/infrastructure/payment.tsx";
import { fuzzyFilter } from "@/lib/filters.ts";
import {
  ColumnDefinition,
} from "@/app/expenses/components/columns.tsx";
import { toast } from "@/components/ui/use-toast.ts";
import { demoMode } from "@/constants";

export function useTable({
                            data,
                            selectedYear,
                            refreshData
                          }: {
  data: Payment[] | null;
  selectedYear: string | null;
  refreshData(flushPaymentsBeforeRefresh?: boolean): void
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filteredData, setFilteredData] = useState<Payment[]>([]);

  useEffect(() => {
    if (selectedYear === "All" && data)
      setFilteredData(data);
    else if (data && selectedYear !== null) {
      setFilteredData(
        data.filter(
          (payment) =>
            new Date(payment.date).getFullYear() ===
            parseInt(selectedYear ?? ""),
        ),
      );
    }
  }, [data, selectedYear]);

  const totalsPerYear =
    data === null
      ? []
      : data.reduce((acc: Total[], payment) => {
        const year = new Date(payment.date).getFullYear();
        const existing = acc.find((t) => t.date === year);
        if (existing) {
          existing.amount += payment.amount;
        } else {
          acc.push({ amount: payment.amount, date: year });
        }
        return acc;
      }, []);

  const columns = useMemo<ColumnDef<Payment, number | string>[]>(
    () => ColumnDefinition,
    [],
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    'date': false,
  })

  const table: Table<any> = useReactTable({
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
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  async function onDeleteConfirmed() {
    console.log("Delete clicked!");
    const ids = table
      .getSelectedRowModel()
      .rows.map((row: any) => row.original.id) as number[];

    const deleted = await DeletePayments(ids);
    
    if(demoMode) {
      toast({
        title: "Data cannot be modified in demo mode!",
        variant: "warning"
      })
    } else if (deleted) {
      refreshData(false);
      table.resetRowSelection();
      toast({
        title: "Transactions deleted!",
        className: "bg-green-600",
      })
    } else {
      toast({
        title: "Couldn't delete transactions!",
        className: "bg-red-500",
      })
    }
  }

  function onPaymentEdited() {
    table.resetRowSelection();
    onRefresh(false).then(() => { });
  }

  async function onRefresh(flushPaymentsBeforeRefresh: boolean = true) {
    table.resetColumnFilters();
    refreshData(flushPaymentsBeforeRefresh);
  }

  return {
    totalsPerYear,
    table,
    onDeleteConfirmed,
    onPaymentEdited,
    onRefresh,
  };
}
