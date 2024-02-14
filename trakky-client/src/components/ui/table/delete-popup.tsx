import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TrashIcon } from '@radix-ui/react-icons';
import { TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Payment } from '@/models/dtos';

export function DeleteDialog({
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
                <div className="m-6 text-sm text-muted-foreground">
                  {entries}
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="mx-6 mb-6">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 mx-6 mt-6 hover:bg-red-600 text-white "
                  onClick={() => {
                    onDeleteConfirmed().then(() => {});
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent className="bg-red-500/50 text-white">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

DeleteDialog.defaultProps = {
  tooltipText: null,
};

export function DeletePaymentsDialog({
  onDeleteConfirmed,
  entries,
}: {
  onDeleteConfirmed: () => Promise<void>;
  entries: Payment[];
}) {
  const tdStyle = 'px-2 text-left border overflow-x-scroll scroll-smooth';

  return (
    <DeleteDialog
      onDeleteConfirmed={onDeleteConfirmed}
      tooltipText="Delete selected rows"
      entries={
        <table className="w-full">
          <tbody className="w-full">
            {entries.map((payment: Payment) => (
              <TableRow key={payment.id} className="flex max-w-[460px]">
                <td className={cn(`${tdStyle} w-[75px] text-left`)}>
                  {new Date(payment.date).toLocaleString('en-GB', {
                    month: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className={cn(`${tdStyle} w-[80px]`)}>{payment.type}</td>
                <td className={cn(`${tdStyle} w-[55px]`)}>{payment.owner}</td>
                <td className={cn(`${tdStyle} text-right w-[100px]`)}>
                  {formatCurrency(payment.amount)}
                </td>
                <td className={cn(`${tdStyle} w-[150px] truncate`)}>
                  {payment.description}
                </td>
              </TableRow>
            ))}
          </tbody>
        </table>
      }
    />
  );
}
