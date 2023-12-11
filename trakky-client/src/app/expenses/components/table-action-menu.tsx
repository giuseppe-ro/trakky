import { PopupDialog } from "@/app/expenses/components/popup-dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PaymentForm } from "@/app/expenses/components/payment-form.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { SelectIcon } from "@radix-ui/react-select";
import { DeletePaymentsDialog } from "@/app/expenses/components/delete-popup.tsx";
import { Payment } from "@/infrastructure/payment.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Table } from "@tanstack/react-table";
import { ExportDropdownMenu } from "@/app/expenses/components/download-dropdown.tsx";

export function TableActionMenu({
  table,
  onRefresh,
  onDeleteConfirmed,
}: {
  table: Table<any>;
  onRefresh: () => void;
  onDeleteConfirmed: () => Promise<void>;
}) {

  return (
    <div className="flex justify-between items-center">
      <div className="flex justify-end gap-x-1 md:gap-x-3 mt-2 md:mt-6 mb-2">
        <PopupDialog
          trigger={
            <Button
              variant="outline"
              className="border-green-500/50 h-8 hover:bg-green-500/50"
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
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={onRefresh}
                className="rounded w-8 flex justify-center items-center hover:text-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
              >
                <ReloadIcon />
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 text-white">
                <p>Refresh</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="rounded w-8 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                onClick={table.getToggleAllPageRowsSelectedHandler()}
              >
                <SelectIcon />
              </TooltipTrigger>
              <TooltipContent tabIndex={-1} className="bg-slate-800 text-white">
                <p>Select/Unselect visible rows</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-center" >
          <ExportDropdownMenu table={table} />
        </div>
        <div className="flex justify-center">
          {table.getIsSomeRowsSelected() && (
            <DeletePaymentsDialog
              tooltipText={"Delete selected rows"}
              onDeleteConfirmed={onDeleteConfirmed}
              payments={table
                .getSelectedRowModel()
                .rows.map((row: any) => row.original as Payment)}
            ></DeletePaymentsDialog>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-x-1 md:gap-x-3 mt-2 md:mt-6 mb-2 ">
        <Select
          value={table.getState().pagination.pageSize.toString()}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="h-8 w-[60px] m-0 rounded-md text-xs md:text-sm font-thin md:font-light">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
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
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
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
  );
}
