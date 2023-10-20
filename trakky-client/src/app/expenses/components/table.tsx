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
import {
  Select,
  SelectContent,
  Selection,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { Summary, Total } from "@/app/expenses/components/summary";
import { Payment } from "@/infrastructure/payment";
import { fuzzyFilter } from "@/lib/filters";
import Spinner from "@/components/ui/spinner";
import { PopupDialog } from "@/app/expenses/components/popup-dialog.tsx";
import { cn } from "@/lib/utils.ts";
import { SelectIcon } from "@radix-ui/react-select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import axios from "axios";
import { PaymentForm } from "@/app/expenses/components/payment-form.tsx";
import { DeletePayments } from "@/app/expenses/components/delete-popup.tsx";
import { Filter } from "@/app/expenses/components/column-filter.tsx";
import {
  colSize,
  ColumnDefinition,
} from "@/app/expenses/components/columns.tsx";
import { PenBoxIcon } from "lucide-react";
import { serverUrl } from "@/constants.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export function DataTable({
  data,
  selection,
  refreshData,
  ...props
}: {
  data: Payment[];
  selection?: string;
  refreshData: () => void;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [filteredData, setFilteredData] = useState<Payment[]>([]);

  const availableYears = data
    .reduce((acc: number[], payment) => {
      const year = new Date(payment.date).getFullYear();
      if (!acc.includes(year)) {
        acc.push(year);
      }
      return acc;
    }, [])
    .sort((a, b) => b - a)
    .map((year) => year.toString());

  availableYears.push("All");

  const [selectedYear, setSelectedYear] = useState(
    selection ? selection : availableYears[0],
  );

  useEffect(() => {
    if (selection) setSelectedYear(selection);
  }, [selection]);

  useEffect(() => {
    if (selectedYear === "All") setFilteredData(data);
    else {
      setFilteredData(
        data.filter(
          (payment) =>
            new Date(payment.date).getFullYear() === parseInt(selectedYear),
        ),
      );
    }
  }, [data, selectedYear]);

  const totalsPerYear = data.reduce((acc: Total[], payment) => {
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
    },
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
      .rows.map((row: any) => row.original.id);

    console.log(ids);

    try {
      const res = await axios.delete(`${serverUrl}/payments`, {
        data: ids,
      });

      if (res.status === 200) {
        table.resetRowSelection();
        refreshData();
        alert("Transactions deleted!");
      } else {
        alert("Error! Could not delete transactions");
      }
    } catch (e) {
      alert("Error! Could not delete transactions");
    }
  }

  function onPaymentEdited() {
    table.resetRowSelection();
    onRefresh();
  }

  function onRefresh() {
    table.resetColumnFilters();
    refreshData();
  }

  return (
    <div {...props}>
      {
        <>
          {selectedYear && selection === undefined && (
            <Selection
              value={selectedYear}
              onChange={setSelectedYear}
              options={availableYears}
              {...{
                className:
                  "rounded-md w-full overscroll-contain mb-4 sticky top-20 bg-gray-950 z-50",
              }}
            />
          )}
          {filteredData.length === 0 ? (
            <div className="container h-full mt-16">
              <Spinner />
            </div>
          ) : (
            <Summary
              table={table}
              totalsPerYear={totalsPerYear}
              selectedYear={selectedYear}
            />
          )}
          <div className="flex justify-between items-center">
            <div className="flex justify-end gap-x-1 md:gap-x-3 mt-6 mb-2">
              <PopupDialog
                trigger={
                  <Button
                    variant="outline"
                    className="border-green-800 h-8 hover:bg-green-800"
                  >
                    Add
                  </Button>
                }
              >
                <PaymentForm
                  refresh={onRefresh}
                  title={"Add New Transaction"}
                ></PaymentForm>
              </PopupDialog>
              {refreshData !== undefined && (
                <div className="flex justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="outline"
                          className="h-8 w-9 p-0 border-none flex ml-0"
                          onClick={onRefresh}
                        >
                          <ReloadIcon />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 text-white">
                        <p>Refresh</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <div className="flex justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="outline"
                        className="h-8 w-9 p-0 border-none flex ml-0"
                        onClick={table.getToggleAllPageRowsSelectedHandler()}
                      >
                        <span className="sr-only">Reload</span>
                        <SelectIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white">
                      <p>Select/Unselect visible rows</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-center">
                {table.getIsSomeRowsSelected() && (
                  <DeletePayments
                    tooltipText={"Delete selected rows"}
                    onDeleteConfirmed={onDeleteConfirmed}
                    payments={table
                      .getSelectedRowModel()
                      .rows.map((row: any) => row.original as Payment)}
                  ></DeletePayments>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-x-1 md:gap-x-3 mt-6 mb-2 ">
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[60px] m-0 rounded-md text-xs md:text-sm font-thin md:font-light">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent
                  side="top"
                  className="bg-slate-900 focus:bg-slate-600 active:bg-slate-600"
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center text-sm font-thin whitespace-nowrap">
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className={"flex justify-between gap-x-2"}>
                <div className="flex gap-x-1">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 hidden md:flex ml-0"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to first page</span>
                    <DoubleArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-x-1">
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0 hidden md:flex"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to last page</span>
                    <DoubleArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Table className="rounded-b-md bg-slate-950  border border-slate-800 overflow-x-scroll">
            <TableHeader className="hover:bg-transparent">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        className="rounded-md border border-slate-800 text-center text-xs md:text-sm"
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
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                            {header.column.getCanFilter() ? (
                              <div className="m-0 p-0">
                                <Filter column={header.column} table={table} />
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
                        "bg-slate-400/50 hover:bg-slate-400",
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
                      <PopupDialog
                        trigger={
                          <Button
                            variant="outline"
                            className="bg-transparent hover:bg-transparent p-0 mx-1 my-0 h-5 border-none hover:text-green-500"
                          >
                            <PenBoxIcon
                              width={16}
                              height={16}
                              className="hover:text-green-500 text-green-700"
                            ></PenBoxIcon>
                          </Button>
                        }
                      >
                        <PaymentForm
                          editValues={row.original as Payment}
                          refresh={onPaymentEdited}
                          title={"Edit Transaction"}
                        ></PaymentForm>
                      </PopupDialog>
                    </td>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      }
    </div>
  );
}
