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
import { Button } from "@/components/ui/button.tsx";
import { TrashIcon } from "@radix-ui/react-icons";
import { Payment } from "@/infrastructure/payment.tsx";
import { TableRow } from "@/components/ui/table.tsx";
import { formatCurrency, formatStringDate } from "@/lib/formatter.ts";

export function DeletePayments({
  onDeleteConfirmed,
  payments,
  tooltipText,
}: {
  onDeleteConfirmed: () => Promise<void>;
  payments: Payment[];
  tooltipText?: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="h-8 w-4 p-0 border-none text-white  hover:bg-transparent hover:text-red-500 flex ml-0"
              >
                <TrashIcon className="hover:text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[450px] overflow-auto ">
              <AlertDialogHeader>
                <div className="sticky top-0 z-50 bg-gray-950">
                  <AlertDialogTitle>
                    Are you sure? This action cannot be undone.
                    <p className="text-sm text-muted-foreground pb-2">
                      This will permanently delete the below transactions:
                    </p>
                  </AlertDialogTitle>
                </div>

                <AlertDialogDescription>
                  <div className="mt-2">
                    {payments.map((payment: Payment) => (
                      <div>
                        <TableRow
                          key={payment.id}
                          className="border border-slate-808"
                        >
                          <td className="px-2 border w-16">
                            {formatStringDate(payment.date)}
                          </td>
                          <td className="px-2 border w-16">{payment.type}</td>
                          <td className="px-2 border w-16">{payment.owner}</td>
                          <td className="px-2 border w-24">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-2 border w-36">
                            {payment.description}
                          </td>
                        </TableRow>
                      </div>
                    ))}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => {
                    onDeleteConfirmed();
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
