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
import { formatCurrency } from "@/lib/formatter.ts";
import { cn } from "@/lib/utils.ts";

export function DeletePayments({
  onDeleteConfirmed,
  payments,
  tooltipText,
}: {
  onDeleteConfirmed: () => Promise<void>;
  payments: Payment[];
  tooltipText?: string;
}) {
  const tdStyle = "px-2 text-left border overflow-auto scroll-smooth";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger tabIndex={-1}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="h-8 w-4 p-0 border-none text-red-600  hover:bg-transparent hover:text-red-500/50 flex ml-0"
              >
                <TrashIcon className="hover:text-red-500/50" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[450px]  p-2 md:p-6 overflow-auto ">
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
                        <TableRow key={payment.id}>
                          <td
                            className={cn(
                              `${tdStyle} min-w-[75px] max-w-[75px] text-left`,
                            )}
                          >
                            {new Date(payment.date).toLocaleString("en-GB", {
                              month: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td
                            className={cn(
                              `${tdStyle} min-w-[75px] max-w-[75px]`,
                            )}
                          >
                            {payment.type}
                          </td>
                          <td className={cn(`${tdStyle} w-16 max-w-[100px]`)}>
                            {payment.owner}
                          </td>
                          <td
                            className={cn(
                              `${tdStyle} min-w-[70px] md:min-w-[100px] max-w-[80px] md:max-w-[100px] text-right`,
                            )}
                          >
                            {formatCurrency(payment.amount)}
                          </td>
                          <td
                            className={cn(
                              `${tdStyle} min-w-[70px] w-screen max-w-[80px] md:max-w-[150px]`,
                            )}
                          >
                            {payment.description}
                          </td>
                        </TableRow>
                      </div>
                    ))}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="pt-8">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white "
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
