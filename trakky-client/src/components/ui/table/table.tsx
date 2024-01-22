"use client";

import {
  flexRender,
} from "@tanstack/react-table";

import { Table as TableType } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { cn } from "@/lib/utils.ts";
import { Filter } from "@/components/ui/table/column-filter.tsx";
import {
  colSize,
} from "@/components/ui/table/columns.tsx";
import { FadeUp } from "@/components/animations/fade.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { ChevronDown } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";

export interface CustomTableProps {
  table: TableType<any>;
  page: string;
  filtersOnly: boolean;
  tableActionMenu?: ReactNode;
}

export function CustomTable({
  tableProps,
  ...props
}: {
  tableProps: CustomTableProps;
}) {
  const [showTableBody, setShowTableBody] = useState<boolean>(!tableProps.filtersOnly);

  const activeColumnsKey = `${tableProps.page}_active_columns`;

  useEffect(() => {
    const storedActiveColumns = localStorage.getItem(activeColumnsKey);

    if (storedActiveColumns) {
      try {
        tableProps.table.setColumnVisibility(JSON.parse(storedActiveColumns));
      } catch (e) {
        localStorage.removeItem("expenses_active_columns")
        console.log(e);
      }
    } else {
      let activeColumns = "{";
      Object.values(tableProps
        .table
        .getAllColumns())
        .forEach((column) => {
          if (column.getCanHide()) {
            console.log(column.id, column.getIsVisible());
            activeColumns += `"${column.id}":${column.getIsVisible()},`
          }
        });
      activeColumns = activeColumns.substring(0, activeColumns.length - 1);
      activeColumns += "}";
      localStorage.setItem(activeColumnsKey, activeColumns);
    }
  }, []);

  const saveActiveCols = (col: string, state: boolean) => {
    const storedActiveColumns = localStorage.getItem(activeColumnsKey);

    if (storedActiveColumns) {
      let activeColumns = JSON.parse(storedActiveColumns);
      activeColumns[col] = state;
      localStorage.setItem(activeColumnsKey, JSON.stringify(activeColumns));
    }
  }

  return (
    <div {...props}>
      {
        <>
          <FadeUp>
            {
              tableProps.tableActionMenu && (tableProps.tableActionMenu)
            }
            <Table className="bg-slate-950 border border-slate-800 overflow-x-scroll">
              <TableHeader className="hover:bg-transparent">
                {tableProps.table.getHeaderGroups().map((headerGroup) => (
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
                                  onClick: showTableBody ? (header.column.getToggleSortingHandler()) : (() => {})
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
                                    table={tableProps.table}
                                  />
                                </div>
                              ) : header.id == "edit" ? <> <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <a className="bg-transparent hover:bg-transparent p-0 m-0 flex justify-center w-full h-full border-none active:bg-transparent focus:bg-transparent focus-visible:bg-transparent text-slate-600 hover:text-slate-500">
                                    <ChevronDown className="h-6 w-6 cursor-pointer" />
                                  </a>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {tableProps.table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                      return (
                                        <DropdownMenuCheckboxItem
                                          key={column.id}
                                          className="capitalize"
                                          checked={column.getIsVisible()}
                                          onCheckedChange={(value) => {
                                            column.toggleVisibility(value);
                                            saveActiveCols(column.id, value);
                                          }
                                          }
                                        >
                                          {column.id}
                                        </DropdownMenuCheckboxItem>
                                      )
                                    })}
                                </DropdownMenuContent>
                              </DropdownMenu></> : null}
                            </>
                          )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              {
                  <TableBody>
                    {
                      showTableBody &&
                      !tableProps.filtersOnly &&
                      tableProps.table.getRowModel().rows.map((row) => {
                      return (
                        <TableRow
                          key={row.id}
                          onClick={row.getToggleSelectedHandler()}
                          className={cn(
                            "hover:bg-slate-800/50 border border-slate-800 transition",
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
                        </TableRow>
                      );
                    })
                    }
                    { !tableProps.filtersOnly &&
                      <TableRow className="p-0 m-0">
                        <td colSpan={tableProps.table.getAllColumns().length} className="p-0 m-0">
                          <Button
                            variant="outline"
                            onClick={() => setShowTableBody(!showTableBody)}
                            className="w-full rounded-none h-6 p-0 m-0 text-muted-foreground"
                          >
                            {showTableBody ? "Hide" : "Show"} data
                          </Button>
                        </td>
                      </TableRow>
                    }
                  </TableBody>
              }

            </Table>
          </FadeUp>
        </>
      }
    </div>
  );
}
