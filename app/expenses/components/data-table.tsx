import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getFilteredRowModel,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

import * as React from "react"
import { DataTablePagination } from "./pagination"
import { Filter } from "./filter"
import {Summary} from "@/app/expenses/components/summary";
import {Payment} from "@/app/expenses/components/columns";


interface DataTableProps<TValue> {
    columns: ColumnDef<Payment, TValue>[]
    data: Payment[]
    availableYears: string[],
    selectedYear: string,
    setSelectedYear: (year: string) => void,
    previousYearTotals: number
}

export function DataTable<TValue>({
    columns,
    data,
    availableYears,
    selectedYear,
    setSelectedYear,
    previousYearTotals
}: DataTableProps<TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})


  const colSize = (id: string): number | string => {
      switch (id) {
          case "description":
              return "auto"
            case "type":
                return 80
            case "owner":
                return 70
            default:
                return 90
      }
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div>
        <div>
            <Summary table={table} previousYearTotals={previousYearTotals} />
        </div>

        <div className="flex items-center pt-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        Columns
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="center">
                    {table
                    .getAllColumns()
                    .filter(
                        (column) => column.getCanHide()
                    )
                    .map((column) => {
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(value)
                            }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div className="row">
            <DataTablePagination
                table={table}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                availableYears={availableYears}
            />
        </div>

      <Table className="rounded-b-md bg-slate-950" >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="rounded-md border border-slate-800" key={header.id} {...{
                    colSpan: header.colSpan,
                    style: {
                      width: colSize(header.id),
                      maxWidth: colSize(header.id),
                        backgroundColor: "bg-slate-950",
                    },
                  }}>
                    {!header.isPlaceholder && header.column.getCanFilter()
                      ? (
                        <div className="items-center justify-center flex-col">
                            {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                          <Filter column={header.column} table={table} />
                        </div>
                      )
                      :
                      null
                    }
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
              className="hover:bg-slate-800/50"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border border-slate-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

    </div>

  )
}
