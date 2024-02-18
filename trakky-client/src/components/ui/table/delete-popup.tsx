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
import { ReactNode } from 'react';
import { Payment } from '@/models/dtos';
import PaymentsRecap from '@/components/payments/payments-recap';

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
                <div className="flex justify-center align-middle m-6 text-sm text-muted-foreground">
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
  return (
    <DeleteDialog
      onDeleteConfirmed={onDeleteConfirmed}
      tooltipText="Delete selected rows"
      entries={<PaymentsRecap entries={entries} />}
    />
  );
}
