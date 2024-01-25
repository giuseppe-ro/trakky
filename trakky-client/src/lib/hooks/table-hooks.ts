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

import { Total } from "@/components/ui/summary.tsx";
import { DeletePayments, Payment, UploadPayments } from "@/infrastructure/payment.tsx";
import { fuzzyFilter } from "@/lib/filters.ts";
import {
  PaymentColumnDefinition,
  BudgetColumnDefinition,
} from "@/components/ui/table/columns.tsx";
import { toast } from "@/components/ui/use-toast.ts";
import { demoMode } from "@/constants";
import { Budget, DeleteBudgets } from "@/infrastructure/budget.tsx";
import * as z from "zod";

export function useExpensesTable({
                            data,
                            selectedYear,
                            refreshData
                          }: {
  data: Payment[] | null;
  selectedYear: string | null;
  refreshData(flushBeforeRefresh?: boolean): void
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
        const month = new Date(payment.date).getMonth();

        const existing = acc.find((t) =>
          t.date?.getFullYear() === year && t.date?.getMonth() === month
        );
        if (existing) {
          existing.amount += payment.amount;
        } else {
          acc.push({ amount: payment.amount, number: year, date: new Date(year, month) });
        }
        return acc;
      }, []);

  const columns = useMemo<ColumnDef<Payment, number | string>[]>(
    () => PaymentColumnDefinition(refreshData),
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

  function onEdited() {
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
    onPaymentEdited: onEdited,
    onRefresh
  };
}


export function useBudgetsTable({
                                   data,
                                   refreshData
                                 }: {
  data: Budget[] | null;
  refreshData(flushBeforeRefresh?: boolean): void
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filteredData, setFilteredData] = useState<Budget[]>([]);

  useEffect(() => {
    if (data !== null) {
      setFilteredData(data);
    }
  }, [data]);

  const columns = useMemo<ColumnDef<Budget, number | string>[]>(
    () => BudgetColumnDefinition(data, refreshData),
    [],
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    'date': true,
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

    const deleted = await DeleteBudgets(ids);

    if(demoMode) {
      toast({
        title: "Data cannot be modified in demo mode!",
        variant: "warning"
      })
    } else if (deleted) {
      refreshData(false);
      table.resetRowSelection();
      toast({
        title: "Deleted!",
        className: "bg-green-600",
      })
    } else {
      toast({
        title: "Couldn't delete!",
        className: "bg-red-500",
      })
    }
  }

  function onEdited() {
    table.resetRowSelection();
    onRefresh(false).then(() => { });
  }

  async function onRefresh(flushBeforeRefresh: boolean = true) {
    table.resetColumnFilters();
    refreshData(flushBeforeRefresh);
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
  onRefresh?: (flushBeforeRefresh?: boolean) => void
): Promise<void> {

  if(demoMode) {
    toast({
      variant: "warning",
      title: "Data cannot be modified in demo mode!",
    })
    return;
  }

  const reader = new FileReader();

  const paymentsSchema = z.array(
    z.object({
      owner: z.string().min(1),
      type: z.string().min(1),
      date: z.string().refine((val) => new Date(val) !== null, { message: "invalid date" }),
      amount: z.number().refine((val) => val !== 0, {
        message: "cannot be 0",
      }),
      description: z.string().refine((val) => val.length <= 50 && val.length > 0),
    })
  );

  console.log("reading: ", file.name)
  reader.onload = async (e) => {
    const result = e.target?.result;
    if (typeof result === "string") {
      try {
        paymentsSchema.parse(JSON.parse(result));
      } catch (e) {
        if(e instanceof z.ZodError) {
          toast({
              variant: "destructive",
              title: "Invalid file format!",
            })
        } else {
          console.log(e);
          toast({
            variant: "destructive",
            title: "Upload Failed!",
          })
        }
      }
    }
  };

  reader.readAsText(file);

  try {
    const uploadResult = await UploadPayments(file);

    if(uploadResult === null) {
      toast({
        variant: "success",
        description: "Upload Successful!",
      })
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: uploadResult,
      })
    }
  } catch ( e: any ) {
    console.log(e);
    toast({
      variant: "destructive",
      title: e.data,
    })
  } finally {
    if(onRefresh) {
      onRefresh();
    }
  }
}