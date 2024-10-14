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
import { errorMessage } from '@/components/ui/table/form-error-message';
import { twMerge } from 'tailwind-merge';
import { OwedBalance } from '@/models/debitor-balance';
import PaymentsRecap from '@/components/payments/payments-recap';
import { useEffect, useState } from 'react';
import { Payment } from '@/models/dtos';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@radix-ui/react-popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Client } from '@/infrastructure/client-injector';
import { Endpoint } from '@/constants';
import { Button } from '../button';
import { Calendar } from '../calendar';
import { resultToast } from '../use-toast';

function PayDebitDialog({
  debitorName,
  owed,
  tooltipText,
  onConfirm,
  className,
}: {
  debitorName: string;
  owed: OwedBalance;
  onConfirm: () => Promise<void>;
  tooltipText?: string;
  className?: string;
}) {
  const [entries, setEntries] = useState<Payment[]>();
  const [date, setDate] = useState<Date>();
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const payments: Payment[] = [];
    const localDate = date?.toISOString() ?? undefined;

    payments.push({
      amount: -owed.amount,
      type: 'General',
      owner: owed.to,
      description: 'Expenses Share',
      date: localDate ?? '',
    });

    payments.push({
      amount: owed.amount,
      type: 'General',
      owner: debitorName,
      description: 'Expenses Share',
      date: localDate ?? '',
    });

    setEntries(payments);
  }, [owed, debitorName, date]);

  async function onConfirmed() {
    setIsError(false);

    const { data, error } = await Client.Post(Endpoint.Payments, entries);
    if (error || !data) {
      errorMessage(setIsError, error?.error);
      return;
    }

    resultToast({
      isError: isError ?? false,
      message: 'Transaction saved',
    });

    await onConfirm();
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger tabIndex={-1}>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                className={twMerge(
                  'inline-flex items-center p-3 m-0 justify-center text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow px-4 border-destructive bg-green-600 text-white hover:bg-green-700 my-0 py-0',
                  className
                )}
              >
                Clear
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="h-[400px] overflow-auto ">
              <AlertDialogHeader className="justify-center">
                <div className="sticky top-0 z-40">
                  <AlertDialogTitle>
                    <div className="text-center">Clear debit?</div>

                    <div className="flex justify-center my-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, 'PPP')
                            ) : (
                              <span>Select a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            className="bg-popover border rounded-lg"
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <p
                      className={twMerge(
                        'text-sm mb-2 text-muted-foreground pb-2',
                        !date && 'text-yellow-500 pt-5 text-center'
                      )}
                    >
                      {date
                        ? 'This will create the below entries:'
                        : 'Select the date to create the new entries for.'}
                    </p>
                  </AlertDialogTitle>
                  {entries && <PaymentsRecap entries={entries} />}
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="z-10">
                <AlertDialogCancel
                  className="mx-6 mb-6"
                  onClick={() => {
                    setDate(undefined);
                  }}
                >
                  Cancel
                </AlertDialogCancel>
                {date && (
                  <AlertDialogAction
                    className="bg-green-500 mx-6 mt-6 hover:bg-green-600 text-primary"
                    onClick={() => {
                      onConfirmed().then(() => {});
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                )}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TooltipTrigger>
        <TooltipContent className="bg-green-600/50 text-primary">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

PayDebitDialog.defaultProps = {
  tooltipText: null,
  className: null,
};

export default PayDebitDialog;
