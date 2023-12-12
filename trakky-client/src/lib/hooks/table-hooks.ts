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

export function useTable({
                            data,
                            selectedYear,
                            refreshData
                          }: {
  data: Payment[] | null;
  selectedYear: string | null;
  refreshData: () => void;
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

    if (deleted) {
      table.resetRowSelection();
      refreshData();
      alert("Transactions deleted!");
    } else {
      alert("Error! Could not delete transactions");
    }
  }

  function onPaymentEdited() {
    table.resetRowSelection();
    onRefresh().then(() => { });
  }

  async function onRefresh() {
    table.resetColumnFilters();
    refreshData();
  }

  return {
    totalsPerYear,
    table,
    onDeleteConfirmed,
    onPaymentEdited,
    onRefresh,
  };
}
