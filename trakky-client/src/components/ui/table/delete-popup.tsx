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
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

function DeleteDialog({
  onDeleteConfirmed,
  entries,
  tooltipText,
  className,
}: {
  onDeleteConfirmed: () => Promise<void>;
  entries: ReactNode;
  tooltipText?: string;
  className?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger tabIndex={-1}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                className={twMerge(
                  'inline-flex items-center h-10 justify-center text-base sm:text-xs sm:font-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow px-4 border-destructive bg-destructive text-white w-24 hover:bg-destructive/50 my-0 py-0 rounded',
                  className
                )}
              >
                Delete
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[450px] overflow-auto ">
              <AlertDialogHeader>
                <div className="sticky top-0 z-50">
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
                  className="bg-red-500 mx-6 mt-6 hover:bg-red-600 text-primary"
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
        <TooltipContent className="bg-red-500/50 text-primary">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

DeleteDialog.defaultProps = {
  tooltipText: null,
  className: null,
};

export default DeleteDialog;
