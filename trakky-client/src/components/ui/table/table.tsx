'use client';

import { flexRender, Header, Table as TableType } from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { twMerge } from 'tailwind-merge';
import Filter from '@/components/ui/table/column-filter';
import { colSize } from '@/components/ui/table/columns';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SubTitle } from '@/components/ui/text';
import DeleteDialog from '@/components/ui/table/delete-popup';
import { StorageKey } from '@/constants';
import { ChevronDownIcon } from 'lucide-react';
import { Icon } from '@/models/dtos';
import { Dictionary, GetCategoryIcon, GetCategoryIconMapping } from './icons';
import renderCell from './cell';

export interface CustomTableProps<TData> {
  table: TableType<TData>;
  page: string;
  filtersOnly: boolean;
}

export function CustomTable<TData extends object>({
  table,
  filtersOnly,
  page,
}: CustomTableProps<TData>) {
  const [atLeastOneColumnIsVisible, setAtLeastOneColumnIsVisible] =
    useState<boolean>(!filtersOnly);
  const [showTableBody, setShowTableBody] = useState<boolean>(!filtersOnly);
  const [iconMapping, setIconMapping] = useState<Dictionary<string>>();

  const activeColumnsKey = `${page}_${StorageKey.ActiveColumns}`;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const availableColumns = table
      .getAllColumns()
      .filter((column) => column.getIsVisible()).length;

    setAtLeastOneColumnIsVisible(availableColumns > 1);
  });

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

  useEffect(() => {
    GetCategoryIconMapping().then((mapping) => {
      setIconMapping(mapping);
    });
  }, []);

  const saveActiveCols = (col: string, state: boolean) => {
    const storedActiveColumns = localStorage.getItem(activeColumnsKey);

    if (storedActiveColumns) {
      const activeColumns = JSON.parse(storedActiveColumns);
      activeColumns[col] = state;
      localStorage.setItem(activeColumnsKey, JSON.stringify(activeColumns));
    }
  };

  const availableColumns = table
    .getAllColumns()
    .filter((column) => column.getCanHide() && column.getCanPin());

  const renderFilterCells = (header: Header<TData, unknown>) => {
    if (header.id === 'edit' && !filtersOnly) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex flex-row justify-center align-middle">
              <ChevronDownIcon className="h-4 w-4 cursor-pointer mx-1.5" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {availableColumns.map((column) => {
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
      );
    }

    if (header.column.getCanFilter())
      return (
        <div className="pt-2">
          <Filter column={header.column} table={table} />
        </div>
      );

    return null;
  };

  return (
    <div>
      <Table>
        <TableHeader className="hover:bg-transparent">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const disableEditColumn = filtersOnly && header.id === 'edit';
                return disableEditColumn ? null : (
                  <TableHead
                    className="h-full border  text-center text-xs md:text-sm"
                    key={header.id}
                    {...{
                      colSpan: header.colSpan,
                      style: {
                        width: colSize(header.id),
                        maxWidth: colSize(header.id),
                        fontSize: 14,
                        paddingTop: 10,
                        overflow: 'hidden',
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className:
                              'cursor-pointer select-none text-base sm:text-sm',
                            onClick: showTableBody
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
        <TableBody className="border">
          {showTableBody &&
            atLeastOneColumnIsVisible &&
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  onClick={row.getToggleSelectedHandler()}
                  className={twMerge(
                    'sm:hover:bg-muted-foreground/40 h-12 sm:h-10 border overflow-x-scroll hover:sm:animate-pulse',
                    row.getIsSelected() &&
                      'bg-muted-foreground/50 hover:bg-muted-foreground/40 hover:animate-none'
                  )}
                  {...{
                    style: {
                      overflowX: 'auto',
                    },
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return cell.column.id === 'edit' && filtersOnly ? null : (
                      <td key={cell.id} className="h-8 px-2 truncate text-sm">
                        {renderCell(row, cell, iconMapping, filtersOnly)}
                      </td>
                    );
                  })}
                </TableRow>
              );
            })}
          {filtersOnly && (
            <TableRow className="p-0 m-0" aria-label="Hide Table Button">
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

CustomTable.displayName = 'CustomTable';
interface CustomSmallTableProps {
  title: string;
  values: SmallTableRow[];
  onDeleteConfirmed: (id: number) => Promise<void>;
  addComponent?: JSX.Element;
}

export interface SmallTableRow {
  id: number;
  name: string;
  icon?: Icon[];
}

export function CustomSmallTable({
  title,
  values,
  onDeleteConfirmed,
  addComponent,
}: CustomSmallTableProps) {
  const [iconMapping, setIconMapping] = useState<Dictionary<string>>();

  useEffect(() => {
    GetCategoryIconMapping().then((mapping) => {
      setIconMapping(mapping);
    });
  }, [values]);

  return (
    <div className="flex-grow">
      <SubTitle
        title={title}
        {...{ className: 'text-center mt-4 mb-0 lg:mb-6' }}
      />
      {addComponent}
      <table>
        <tbody>
          {values &&
            values.map((value: SmallTableRow) => (
              <TableRow
                key={value.id}
                className="w-full justify-center align-middle rounded-r"
              >
                <td
                  className={twMerge(
                    `text-left border-r-0 py-0.5 px-2 font-thin text-xs w-full border overflow-x-scroll scroll-smooth`
                  )}
                >
                  <div className="flex gap-2">
                    <div>
                      {iconMapping &&
                        GetCategoryIcon({
                          key: value.name,
                          mapping: iconMapping,
                          show_default: false,
                        })}
                    </div>
                    <div className="content-center">{value.name}</div>
                  </div>
                </td>
                <td
                  className="m-6 text-left border px-0 py-0 overflow-x-scroll scroll-smooth"
                  aria-label="Delete Selected Rows"
                >
                  <DeleteDialog
                    onDeleteConfirmed={() => onDeleteConfirmed(value.id)}
                    entries={value.name}
                    tooltipText="Delete"
                    className="rounded-none"
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

CustomSmallTable.defaultProps = {
  addComponent: null,
};
