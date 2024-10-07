import { memo, ReactNode, useEffect, useState } from 'react';
import { PopupDialog } from '@/components/ui/table/popup-dialog';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  ReloadIcon,
} from '@radix-ui/react-icons';
import { SelectIcon } from '@radix-ui/react-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table } from '@tanstack/react-table';
import { ExportDropdownMenu } from '@/components/ui/table/download-dropdown';
import { Client } from '@/infrastructure/client-injector';
import { Endpoint } from '@/constants';
import { Category } from '@/models/dtos';

function TableNavigation<TData>({
  getState,
  setPageSize,
  getPageCount,
  setPageIndex,
  getCanPreviousPage,
  getCanNextPage,
  nextPage,
  previousPage,
}: Table<TData>) {
  const noData = getState().pagination.pageSize === 0;

  return (
    <div className="flex justify-between gap-x-3 md:gap-x-3 mb-2 ">
      <Select
        disabled={noData}
        value={getState().pagination.pageSize.toString()}
        onValueChange={(value) => {
          setPageSize(Number(value));
        }}
      >
        <SelectTrigger className="h-10 w-[60px] m-0 rounded-md text-xs md:text-sm font-thin md:font-light">
          <SelectValue placeholder={getState().pagination.pageSize} />
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
        Page{' '}
        {!noData &&
          `${getState().pagination.pageIndex + 1} of 
            ${getPageCount()}`}
      </div>
      <div className="flex justify-between gap-x-2">
        <div className="flex gap-x-1">
          <Button
            variant="outline"
            className="h-10 w-10 p-0 ml-0"
            onClick={() => setPageIndex(0)}
            disabled={!getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-x-1">
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => setPageIndex(getPageCount() - 1)}
            disabled={!getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface TableActionMenuTopProps<TData> {
  table: Table<TData>;
  onRefresh: (flushPaymentsBeforeRefresh?: boolean) => void;
  addForm: ReactNode;
  exportName: string;
  deleteForm: ReactNode;
  children: ReactNode;
}

const TableActionMenu = memo(
  <TData extends object>(props: TableActionMenuTopProps<TData>) => {
    const { table, onRefresh, addForm, deleteForm, exportName, children } =
      props;

    const [noCategories, setNoCategories] = useState<boolean>(true);
    const noData = table.getCenterRows().length === 0;

    useEffect(() => {
      Client.Get(Endpoint.Categories).then(({ data, error }) => {
        if (error) {
          setNoCategories(true);
          return;
        }
        setNoCategories((data as Category[]).length === 0);
      });
    });

    return (
      <div>
        <div className="mt-2">
          <div className="flex justify-between">
            <div className="flex gap-x-5 mt-2 mb-2">
              <div className="order-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <PopupDialog
                        trigger={
                          <div className="inline-flex items-center justify-center text-xs md:text-sm font-thin md:font-light transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-8 px-4 py-2 border-green-500/50 bg-green-600 text-white rounded w-20 hover:bg-green-500/50">
                            Add
                          </div>
                        }
                      >
                        {addForm}
                      </PopupDialog>
                    </TooltipTrigger>

                    <TooltipContent className="bg-slate-800 text-white">
                      {noCategories
                        ? 'Add at least a new category in settings to add transactions'
                        : 'Add New Transaction'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-center order-2 sm:order-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      disabled={noData}
                      onClick={() => onRefresh(true)}
                      className="rounded flex justify-center items-center text-white disabled:text-gray-700 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    >
                      <ReloadIcon />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white">
                      Refresh
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-center order-3 sm:order-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      disabled={noData}
                      className="rounded hover:text-gray-700 text-white disabled:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                      onClick={table.getToggleAllPageRowsSelectedHandler()}
                    >
                      <SelectIcon />
                    </TooltipTrigger>
                    <TooltipContent
                      tabIndex={-1}
                      className="bg-slate-800 text-white"
                    >
                      Select/Unselect visible rows
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {!noData && (
                <div className="flex justify-center order-4 sm:order-4">
                  <ExportDropdownMenu table={table} name={exportName} />
                </div>
              )}
              {/* {noCategories && (
                <div className="flex self-center text-sm text-orange-300 text-muted order-4 sm:order-4">
                  Set Categories to add transactions
                </div>
              )} */}
            </div>
            <div className="gap-x-3 mt-2 mb-2">
              <div className="flex justify-self-end order-5 sm:order-5">
                {(table.getIsSomeRowsSelected() ||
                  table.getIsAllRowsSelected()) &&
                  deleteForm}
              </div>
            </div>
          </div>
        </div>
        {children}
        <div className="mt-2">{TableNavigation(table)}</div>
      </div>
    );
  }
);

TableActionMenu.displayName = 'TableActionMenu';

export default TableActionMenu;
