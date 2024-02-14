'use client';

import { flexRender, Header, Table as TableType } from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Filter } from '@/components/ui/table/column-filter';
import { colSize } from '@/components/ui/table/columns';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SubTitle } from '@/components/ui/text';
import { SubmittableInput } from '@/components/ui/input';
import { DeleteDialog } from '@/components/ui/table/delete-popup';
import { StorageKey } from '@/constants';
import { ChevronDownIcon } from 'lucide-react';

export interface CustomTableProps<TData> {
  table: TableType<TData>;
  page: string;
  filtersOnly: boolean;
  tableActionMenu?: ReactNode;
  canHideRows?: boolean;
}

export function CustomTable<TData extends object>({
  table,
  filtersOnly,
  page,
  tableActionMenu,
  canHideRows,
}: CustomTableProps<TData>) {
  const [showTableBody, setShowTableBody] = useState<boolean>(!filtersOnly);

  const noData = table.getPageCount() === 0;

  const activeColumnsKey = `${page}_${StorageKey.ActiveColumns}`;

  useEffect(() => {
    const storedActiveColumns = localStorage.getItem(activeColumnsKey);

    if (storedActiveColumns) {
      try {
        table.setColumnVisibility(JSON.parse(storedActiveColumns));
      } catch (e) {
        localStorage.removeItem(activeColumnsKey);
      }
    } else {
      let activeColumns = '{';
      Object.values(table.getAllColumns()).forEach((column) => {
        if (column.getCanHide()) {
          activeColumns += `"${column.id}":${column.getIsVisible()},`;
        }
      });
      activeColumns = activeColumns.substring(0, activeColumns.length - 1);
      activeColumns += '}';
      localStorage.setItem(activeColumnsKey, activeColumns);
    }
  }, [activeColumnsKey, table]);

  const saveActiveCols = (col: string, state: boolean) => {
    const storedActiveColumns = localStorage.getItem(activeColumnsKey);

    if (storedActiveColumns) {
      const activeColumns = JSON.parse(storedActiveColumns);
      activeColumns[col] = state;
      localStorage.setItem(activeColumnsKey, JSON.stringify(activeColumns));
    }
  };

  const renderFilterCells = (header: Header<TData, unknown>) => {
    if (header.column.getCanFilter())
      return (
        <div className="m-0 p-0">
          <Filter column={header.column} table={table} />
        </div>
      );

    if (header.id === 'edit') {
      return (
        <>
          {' '}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-row justify-center align-middle">
                <ChevronDownIcon className="h-4 w-4 cursor-pointer mx-1.5" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
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
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    }

    return null;
  };

  return (
    <div>
      {tableActionMenu && tableActionMenu}
      <Table className="bg-slate-950 border border-slate-800 overflow-x-scroll">
        <TableHeader className="hover:bg-transparent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border border-slate-800">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="h-full border border-slate-800 text-center text-xs md:text-sm"
                    key={header.id}
                    {...{
                      colSpan: header.colSpan,
                      style: {
                        backgroundColor: 'bg-slate-950',
                        width: colSize(header.id),
                        maxWidth: colSize(header.id),
                        overflow: 'auto',
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: 'cursor-pointer select-none',
                            onClick:
                              !noData && showTableBody
                                ? header.column.getToggleSortingHandler()
                                : () => {},
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: '↑',
                            desc: '↓',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {renderFilterCells(header)}
                      </>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {showTableBody &&
            !filtersOnly &&
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  onClick={row.getToggleSelectedHandler()}
                  className={cn(
                    'hover:bg-slate-800/50 border border-slate-800',
                    row.getIsSelected() && 'bg-slate-600/50 hover:bg-slate-600'
                  )}
                  {...{
                    style: {
                      overflow: 'auto',
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
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </TableRow>
              );
            })}
          {!filtersOnly && !noData && canHideRows && (
            <TableRow className="p-0 m-0">
              <td colSpan={table.getAllColumns().length} className="p-0 m-0">
                <Button
                  variant="outline"
                  onClick={() => setShowTableBody(!showTableBody)}
                  className="w-full rounded-none h-6 p-0 m-0 text-muted-foreground"
                >
                  {showTableBody ? 'Hide' : 'Show'} data
                </Button>
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

CustomTable.defaultProps = {
  tableActionMenu: null,
  canHideRows: false,
};

CustomTable.displayName = 'CustomTable';
interface CustomSmallTableProps {
  title: string;
  onAdd: () => void;
  newValue: string;
  setNew: (value: string) => Promise<void> | void;
  values: SmallTableRow[];
  onDeleteConfirmed: (id: number) => Promise<void>;
}

export interface SmallTableRow {
  id: number;
  name: string;
}

export function CustomSmallTable({
  title,
  onAdd,
  newValue,
  setNew,
  values,
  onDeleteConfirmed,
}: CustomSmallTableProps) {
  return (
    <div className="flex-grow">
      <SubTitle
        title={title}
        {...{ className: 'text-center mt-4 mb-0 lg:mb-6' }}
      />
      <div className="flex my-2 flex-row lg:flex-row justify-around">
        <Button
          disabled={newValue.length === 0}
          onClick={onAdd}
          type="submit"
          variant="outline"
          className="rounded-r-none border-green-500/50 hover:bg-green-500/50"
        >
          Add
        </Button>
        <SubmittableInput
          onSubmit={onAdd}
          onChange={(e) => setNew(e.target.value)}
          className="rounded-l-none focus-visible:ring-0 h-8 outline-none"
        />
      </div>
      <table>
        <tbody>
          {values &&
            values.map((value: SmallTableRow) => (
              <TableRow
                key={value.id}
                className="w-full justify-center align-middle"
              >
                <td
                  className={cn(
                    `text-left border-r-0 py-0.5 px-2 font-thin text-xs w-full border overflow-x-scroll scroll-smooth`
                  )}
                >
                  {value.name}
                </td>
                <td
                  className="m-6 text-left border px-0 overflow-x-scroll scroll-smooth"
                  aria-label="Delete Selected Rows"
                >
                  <DeleteDialog
                    onDeleteConfirmed={() => onDeleteConfirmed(value.id)}
                    entries={value.name}
                    tooltipText="Delete"
                  />
                </td>
              </TableRow>
            ))}
        </tbody>
      </table>
    </div>
  );
}

CustomSmallTable.displayName = 'CustomSmallTable';
