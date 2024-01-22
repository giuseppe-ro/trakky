import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog.tsx";
import { TrashIcon } from "@radix-ui/react-icons";
import { Payment } from "@/infrastructure/payment.tsx";
import { TableRow } from "@/components/ui/table.tsx";
import { formatCurrency } from "@/lib/formatter.ts";
import { cn } from "@/lib/utils.ts";
import { ReactNode } from "react";
import { Budget } from "@/infrastructure/budget.tsx";

export function DeletePaymentsDialog({
  onDeleteConfirmed,
  entries,
  tooltipText,
}: {
  onDeleteConfirmed: () => Promise<void>;
  entries: Payment[];
  tooltipText?: string;
}) {
  const tdStyle = "px-2 text-left border overflow-x-scroll scroll-smooth";

  return (
    <DeleteDialog
      onDeleteConfirmed={onDeleteConfirmed}
      tooltipText={tooltipText}
      entries={<>
        {entries.map((payment: Payment) => (
          <TableRow key={payment.id} className="flex">
            <td className={cn(`${tdStyle} w-[75px] text-left`)}>
              {new Date(payment.date).toLocaleString("en-GB", {
                month: "numeric",
                year: "numeric",
              })}
            </td>
            <td className={cn(`${tdStyle} w-[80px]`)}>
              {payment.type}
            </td>
            <td className={cn(`${tdStyle} w-[55px]`)}>
              {payment.owner}
            </td>
            <td
              className={cn(
                `${tdStyle} w-[70px] text-right overflow-auto`,
              )}
            >
              {formatCurrency(payment.amount)}
            </td>
            <td className={cn(`${tdStyle} flex-grow truncate`)}>
              {payment.description}
            </td>
          </TableRow>
        ))}
      </>}
    />
  );
}


export function DeleteBudgetsDialog({
                                       onDeleteConfirmed,
                                       entries,
                                       tooltipText,
                                     }: {
  onDeleteConfirmed: () => Promise<void>;
  entries: Budget[];
  tooltipText?: string;
}) {
  const tdStyle = "px-2 text-left border overflow-x-scroll scroll-smooth";

  return (
    <DeleteDialog
      onDeleteConfirmed={onDeleteConfirmed}
      tooltipText={tooltipText}
      entries={<>
        {entries.map((budget: Budget) => (
          <TableRow key={budget.id} className="flex max-w-[300px] align-middle justify-center">
            <td className={cn(`${tdStyle} w-[100px] text-left`)}>
              {new Date(budget.date).toLocaleString("en-GB", {
                month: "numeric",
                year: "numeric",
              })}
            </td>
            <td
              className={cn(
                `${tdStyle} w-[100px] text-right overflow-auto`,
              )}
            >
              {formatCurrency(budget.budget)}
            </td>
            <td
              className={cn(
                `${tdStyle} w-[100px] text-right overflow-auto`,
              )}
            >
              {formatCurrency(budget.maxBudget)}
            </td>
          </TableRow>
        ))}
      </>}
    />
  );
}


function DeleteDialog({
                       onDeleteConfirmed,
                       entries,
                       tooltipText,
                       }: {
  onDeleteConfirmed: () => Promise<void>;
  entries: ReactNode;
  tooltipText?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger tabIndex={-1}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <TrashIcon className="hover:text-red-500/50 text-red-500 w-8" />
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[450px] overflow-auto ">
              <AlertDialogHeader>
                <div className="sticky top-0 z-50 bg-gray-950">
                  <AlertDialogTitle>
                    Are you sure? This action cannot be undone.
                    <p className="text-sm mb-2 text-muted-foreground pb-2">
                      This will permanently delete the below entries:
                    </p>
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription>
                  <div className="m-1 md:m-6">
                    {entries}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="mx-6 mb-6">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 mx-6 mt-6 hover:bg-red-600 text-white "
                  onClick={() => {
                    onDeleteConfirmed().then(() => {
                      console.log("entries deleted");
                    });
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent className="bg-red-500/50 text-white">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}