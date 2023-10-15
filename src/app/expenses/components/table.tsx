"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  Column,
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
} from "@radix-ui/react-icons";
import { Summary, Total } from "@/app/expenses/components/summary";
import { Payment } from "@/infrastructure/payment";
import { fuzzyFilter, fuzzySort } from "@/lib/filters";
import { formatCurrency, formatDate } from "@/lib/formatter";
import Spinner from "@/components/ui/spinner";

export const colSize = (id: string): number | string => {
  switch (id) {
    case "description":
      return "auto";
    case "date":
      return 70;
    case "type" || "owner":
      return 110;
    case "amount":
      return 115;
    default:
      return 100;
  }
};

export function DataTable({
  data,
  selection,
  ...props
}: {
  data: Payment[];
  selection?: string;
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [filteredData, setFilteredData] = useState<Payment[]>([]);

  const availableYears = data
    .reduce((acc: number[], payment) => {
      const year = payment.date.getFullYear();
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
          (payment) => payment.date.getFullYear() === parseInt(selectedYear),
        ),
      );
    }
  }, [data, selectedYear]);

  const totalsPerYear = data.reduce((acc: Total[], payment) => {
    const year = payment.date.getFullYear();
    const existing = acc.find((t) => t.date === year);
    if (existing) {
      existing.amount += payment.amount;
    } else {
      acc.push({ amount: payment.amount, date: year });
    }
    return acc;
  }, []);

  const columns = useMemo<ColumnDef<Payment, any>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        enableColumnFilter: false,
        enableGlobalFilter: false,
        cell: ({ row }) => {
          const date: Date = row.getValue("date");
          const formatted = formatDate(date);

          return <div className="text-right font-sm">{formatted}</div>;
        },
      },
      {
        accessorKey: "type",
        header: "Type",
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
        cell: ({ row }) => {
          return <div className="font-sm">{row.getValue("type")}</div>;
        },
      },
      {
        accessorKey: "owner",
        header: "Owner",
        filterFn: "fuzzy",
        sortingFn: fuzzySort,
        cell: ({ row }) => {
          return <div className="font-sm">{row.getValue("owner")}</div>;
        },
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("amount"));
          const formatted = formatCurrency(amount);

          return <div className="text-right font-sm">{formatted}</div>;
        },
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
          return <div className="font-sm">{row.getValue("description")}</div>;
        },
      },
    ],
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

  return (
    <div {...props}>
      {filteredData.length === 0 ? (
        <Spinner />
      ) : (
        <>
          {selectedYear && selection === undefined && (
            <Selection
              value={selectedYear}
              onChange={setSelectedYear}
              options={availableYears}
              {...{ className: "rounded-md w-full overscroll-contain mb-4" }}
            />
          )}
          <Summary
            table={table}
            totalsPerYear={totalsPerYear}
            selectedYear={selectedYear}
          />

          <div className="flex justify-end gap-x-3 mt-6 mb-2 ">
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[60px] m-0 rounded-md ">
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
                  className="h-8 w-8 p-0 flex ml-0"
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
                  className="h-8 w-8 p-0 flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
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
                        className="rounded-md border border-slate-800 text-center"
                        key={header.id}
                        {...{
                          colSpan: header.colSpan,
                          style: {
                            backgroundColor: "bg-slate-950",
                            width: colSize(header.id),
                            maxWidth: colSize(header.id),
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
                              <div>
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
                    className="hover:bg-slate-800/50 border border-slate-800 "
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td key={cell.id} className="px-2">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

function Filter({ column, table }: { column: Column<any>; table: any }) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()],
  );

  return typeof firstValue === "number" ? (
    <div>
      <div className="flex space-x-1">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder="Min"
          className="w-1/2 placeholder-slate-700 selection:bg-slate-700 shadow bg-slate-900 pl-2 focus:outline-none"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder="Max"
          className="w-1/2 placeholder-slate-700 selection:bg-slate-700 shadow bg-slate-900 pl-2 focus:outline-none"
        />
      </div>
    </div>
  ) : (
    <>
      <datalist className="bg-slate-900" id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option className="border-slate-900 red" value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={""}
        className="w-full shadow bg-slate-900 text-slate-400 selection:bg-slate-700 pl-2 focus:outline-none"
        list={column.id + "list"}
      />
    </>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
