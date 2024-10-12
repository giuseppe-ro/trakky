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
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
} from 'lucide-react';

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
        <SelectTrigger className="h-12 md:h-10 min-w-12 w-16 md:w-[60px] m-0 rounded-md text-base md:text-sm font-light">
          <SelectValue placeholder={getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent
          side="top"
          className="bg-primary-foreground focus:bg-muted-foreground"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center text-base md:text-sm font-light whitespace-nowrap">
        Page{' '}
        {!noData &&
          `${getState().pagination.pageIndex + 1} of 
            ${getPageCount()}`}
      </div>
      <div className="flex justify-between gap-x-2">
        <div className="flex gap-x-1">
          <Button
            variant="outline"
            className="p-0 ml-0 h-12 md:h-10 w-14 sm:w-16 rounded-none rounded-l"
            onClick={() => setPageIndex(0)}
            disabled={!getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="p-0 ml-0 h-12 md:h-10 w-12 sm:w-10 rounded-none rounded-l"
            onClick={() => previousPage()}
            disabled={!getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
        </div>
        <div className="flex gap-x-1">
          <Button
            variant="outline"
            className="p-0 ml-0 h-12 md:h-10 w-12 sm:w-10 rounded-none rounded-r"
            onClick={() => nextPage()}
            disabled={!getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="ml-0 h-12 md:h-10 w-14 sm:w-16 rounded-none rounded-r"
            onClick={() => setPageIndex(getPageCount() - 1)}
            disabled={!getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
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
            <div className="flex gap-x-3 sm:gap-x-5 mt-2">
              <div className="order-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <PopupDialog
                        trigger={
                          <div className="inline-flex h-10 items-center justify-center text-base sm:text-xs sm:font-light transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow px-4 py-2 border-green-500/50 bg-green-600 text-primary rounded w-20 hover:bg-green-500/50 outline-none">
                            Add
                          </div>
                        }
                      >
                        {addForm}
                      </PopupDialog>
                    </TooltipTrigger>

                    <TooltipContent className="bg-secondary text-primary">
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
                      className="rounded px-4 sm:px-0 text-yellow-600 flex justify-center hover:text-muted-foreground disabled:text-muted  items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    >
                      <RotateCcw width={30} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-secondary text-primary">
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
                      className="rounded px-4 sm:px-0 text-muted-foreground sm:text-primary hover:text-muted-foreground disabled:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                      onClick={table.getToggleAllPageRowsSelectedHandler()}
                    >
                      <ChevronDown />
                    </TooltipTrigger>
                    <TooltipContent
                      tabIndex={-1}
                      className="bg-secondary text-primary"
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
