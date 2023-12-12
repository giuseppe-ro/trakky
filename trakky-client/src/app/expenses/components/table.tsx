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
} from "@/components/ui/table";
import { cn } from "@/lib/utils.ts";
import { Filter } from "@/app/expenses/components/column-filter.tsx";
import {
  colSize,
} from "@/app/expenses/components/columns.tsx";
import { TableActionMenu } from "@/app/expenses/components/table-action-menu.tsx";
import { FadeUp } from "@/components/animations/fade.tsx";

export interface ExpensesTableProps {
  table: TableType<any>;
  onDeleteConfirmed: () => Promise<void>;
  onPaymentEdited: () => void;
  onRefresh: () => Promise<void>;
}

export function ExpensesTable({
  expensesTableProps,
  ...props
}: {
  expensesTableProps: ExpensesTableProps;
}) {

  return (
    <div {...props}>
      {
        <>
          <FadeUp>
            <TableActionMenu
              table={expensesTableProps.table}
              onDeleteConfirmed={expensesTableProps.onDeleteConfirmed}
              onRefresh={expensesTableProps.onRefresh}
            />
            <div>
              <Table className="bg-slate-950 border border-slate-800 overflow-x-scroll">
                <TableHeader className="hover:bg-transparent">
                  {expensesTableProps.table.getHeaderGroups().map((headerGroup) => (
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
                                      table={expensesTableProps.table}
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
                  {expensesTableProps.table.getRowModel().rows.map((row) => {
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
