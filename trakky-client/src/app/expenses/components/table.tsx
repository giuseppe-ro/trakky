"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Summary, Total } from "@/app/expenses/components/summary";
import { DeletePayments, Payment } from "@/infrastructure/payment";
import { fuzzyFilter } from "@/lib/filters";
import { cn } from "@/lib/utils.ts";
import { Filter } from "@/app/expenses/components/column-filter.tsx";
import {
  colSize,
  ColumnDefinition,
} from "@/app/expenses/components/columns.tsx";
import { TableActionMenu } from "@/app/expenses/components/table-action-menu.tsx";
import { EditCell } from "@/app/expenses/components/edit-cell.tsx";
import { FadeUp } from "@/components/animations/fade.tsx";

export interface DataTableProps {
  data: Payment[] | null;
  selectedYear: string | null;
  refreshData: () => void;
}

export function ExpensesTable({
  dataTableProps,
  ...props
}: {
  dataTableProps: DataTableProps;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filteredData, setFilteredData] = useState<Payment[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    if (dataTableProps.selectedYear === "All" && dataTableProps.data)
      setFilteredData(dataTableProps.data);
    else if (dataTableProps.data && dataTableProps.selectedYear !== null) {
      setFilteredData(
        dataTableProps.data.filter(
          (payment) =>
            new Date(payment.date).getFullYear() ===
            parseInt(dataTableProps.selectedYear ?? ""),
        ),
      );
    }
  }, [dataTableProps.data, dataTableProps.selectedYear]);

  const totalsPerYear =
    dataTableProps.data === null
      ? []
      : dataTableProps.data.reduce((acc: Total[], payment) => {
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
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  async function onDeleteConfirmed() {
    console.log("Delete clicked!");
    const ids = table
      .getSelectedRowModel()
      .rows.map((row: any) => row.original.id) as number[];

    console.log(ids);

    const deleted = await DeletePayments(ids);

    if (deleted) {
      table.resetRowSelection();
      dataTableProps.refreshData();
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
    dataTableProps.refreshData();
  }

  return (
    <div {...props}>
      {
        <>
          <Summary
            table={table}
            totalsPerYear={totalsPerYear}
            selectedYear={dataTableProps.selectedYear ?? ""}
          />
          <FadeUp>
            <TableActionMenu
              table={table}
              onDeleteConfirmed={onDeleteConfirmed}
              onRefresh={onRefresh}
            />
            <div>
              <Table className="bg-slate-950 border border-slate-800 overflow-x-scroll">
                <TableHeader className="hover:bg-transparent">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border border-slate-800"
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead
                            className="h-full border border-slate-800 text-center text-xs md:text-sm"
                            key={header.id}
                            {...{
                              colSpan: header.colSpan,
                              style: {
                                backgroundColor: "bg-slate-950",
                                width: colSize(header.id),
                                maxWidth: colSize(header.id),
                                overflow: "auto",
                              },
                            }}
                          >
                            {header.isPlaceholder ? null : (
                              <>
                                <div
                                  {...{
                                    className:
                                      header.column.getCanSort() +
                                        "items-center border justify-center flex-col"
                                        ? "cursor-pointer select-none"
                                        : "",
                                    onClick:
                                      header.column.getToggleSortingHandler(),
                                  }}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                                  {{
                                    asc: "↑",
                                    desc: "↓",
                                  }[header.column.getIsSorted() as string] ??
                                    null}
                                </div>
                                {header.column.getCanFilter() ? (
                                  <div className="m-0 p-0">
                                    <Filter
                                      column={header.column}
                                      table={table}
                                    />
                                  </div>
                                ) : null}
                              </>
                            )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        onClick={row.getToggleSelectedHandler()}
                        className={cn(
                          "hover:bg-slate-800/50 border border-slate-800",
                          row.getIsSelected() &&
                          "bg-slate-600/50 hover:bg-slate-600",
                        )}
                        {...{
                          style: {
                            overflow: "auto",
                          },
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <td
                              key={cell.id}
                              className="px-2 truncate text-xs font-thin md:font-normal md:text-sm"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </td>
                          );
                        })}
                        <td>
                          <EditCell
                            onPaymentEdited={onPaymentEdited}
                            payment={row.original as Payment}
                          />
                        </td>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </FadeUp>
        </>
      }
    </div>
  );
}
