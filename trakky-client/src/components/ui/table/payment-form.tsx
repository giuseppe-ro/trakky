'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, Field } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Selection } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFormFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { twMerge } from 'tailwind-merge';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useReducer, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Client } from '@/infrastructure/client-injector';
import { resultToast } from '@/components/ui/use-toast';
import { Toggle } from '@/components/ui/toggle';
import {
  FetchActionType,
  paymentFormDataReducer,
  FETCH_INITIAL_STATE,
} from '@/components/ui/table/payment-form-reducer';
import { ErrorMessage } from '@/infrastructure/remote/base';
import { errorMessage } from '@/components/ui/table/form-error-message';
import { CalendarIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { Category, Owner, Payment } from '@/models/dtos';
import PaymentsRecap from '@/components/payments/payments-recap';
import { Endpoint } from '@/constants';
import { format } from 'date-fns';
import Loading from '../loading';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    return { message: '' };
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: '' };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);
const formSchema = z.object({
  id: z.number().optional(),
  owner: z.string(),
  type: z.string(),
  date: z.date(),
  amount: z.number().refine((val) => val !== 0, {
    message: 'cannot be 0',
  }),
  description: z.string().refine((val) => val.length <= 50 && val.length > 0),
});

export function PaymentForm({
  title,
  refresh,
  editValues,
}: {
  title: string;
  refresh: (signal?: AbortSignal, flushPaymentsBeforeRefresh?: boolean) => void;
  editValues?: Payment;
}) {
  const [addedPayments, setAddedPayments] = useState<Payment[]>([]);
  const [amountIsNegative, setAmountIsNegative] = useState(
    editValues ? editValues.amount < 0 : false
  );
  const [fetchState, dispatchFetch] = useReducer(
    paymentFormDataReducer,
    FETCH_INITIAL_STATE
  );
  const [isError, setIsError] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: editValues?.id === undefined ? undefined : Number(editValues?.id),
      date:
        editValues?.date === undefined ? undefined : new Date(editValues?.date),
      owner: editValues?.owner,
      type: editValues?.type,
      amount: editValues?.amount ?? 0,
      description: editValues?.description ?? '',
    },
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const formData = async () => {
      dispatchFetch({ type: FetchActionType.FETCH_START });

      const { data, error: ownersError } = await Client.Get(
        Endpoint.Owners,
        signal
      );

      if (ownersError) {
        dispatchFetch({
          type: FetchActionType.FETCH_ERROR,
          payload: ownersError.error,
        });
        return;
      }

      const ownersData = data as Owner[];
      const fetchedOwners = ownersData.map((owner) => owner.name);
      fetchedOwners.push('Shared');

      dispatchFetch({
        type: FetchActionType.FETCHED_OWNERS,
        payload: fetchedOwners,
      });

      const { data: catData, error: categoriesError } = await Client.Get(
        Endpoint.Categories,
        signal
      );
      if (categoriesError) {
        dispatchFetch({
          type: FetchActionType.FETCH_ERROR,
          payload: categoriesError.error,
        });
        return;
      }

      const categoriesData = catData as Category[];

      const fetchedCategories = categoriesData.map((type) => type.name);

      dispatchFetch({
        type: FetchActionType.FETCHED_CATEGORIES,
        payload: fetchedCategories,
      });
    };

    formData()
      .then(() => {
        dispatchFetch({ type: FetchActionType.FETCH_END });
      })
      .catch(() => {
        dispatchFetch({
          type: FetchActionType.FETCH_ERROR,
          payload: ErrorMessage.INTERNAL_SERVER_ERROR,
        });
      });
  }, [editValues, form]);

  useEffect(() => {
    form.setValue('type', editValues?.type ?? fetchState.categories[0]);
    form.setValue('owner', editValues?.owner ?? fetchState.owners[0]);
    // eslint-disable-next-line
  }, [fetchState.categories, fetchState.owners]);

  function onAmountChange(amount: number) {
    if (amount < 0) {
      setAmountIsNegative(true);
    }

    form.setValue('amount', amount);
  }

  const splitPayments = (payment: Payment) => {
    return fetchState.owners
      .filter((owner: string) => owner !== 'Shared')
      .map(
        (owner: string) =>
          ({
            amount: payment.amount / (fetchState.owners.length - 1),
            type: payment.type,
            owner,
            description: payment.description,
            date: payment.date,
          }) as Payment
      );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsError(false);
    const payment = values as unknown as Payment;

    if (amountIsNegative) {
      payment.amount = -Math.abs(form.getValues('amount'));
    } else {
      payment.amount = Math.abs(form.getValues('amount'));
    }

    let payments: Payment[];
    const isNewPayment = editValues === null;

    if (payment.owner === 'Shared') {
      payments = splitPayments(payment);
      if (!isNewPayment) {
        const { data, error } = await Client.Delete(Endpoint.Payments, [
          Number(payment.id),
        ]);
        if (error || !data) {
          errorMessage(setIsError, error?.error);
          return;
        }
      }
    } else {
      payments = [payment];
    }

    if (isNewPayment || payment.owner === 'Shared') {
      const { data, error } = await Client.Post(Endpoint.Payments, payments);
      if (error || !data) {
        errorMessage(setIsError, error?.error);
        return;
      }
    } else {
      const { data, error } = await Client.Put(Endpoint.Payments, payment);
      if (error || !data) {
        errorMessage(setIsError, error?.error);
        return;
      }
    }

    setAddedPayments(addedPayments.concat(payments));

    resultToast({
      isError: false,
      message: 'Transaction saved',
    });

    setTimeout(() => {
      form.reset();
      form.setValue('owner', payment.owner);
      form.setValue('type', payment.type);
      form.setValue('date', new Date(payment.date));
      refresh(undefined, false);
    }, 1000);
  }

  const cardContent = () => {
    if (fetchState.error !== null) {
      return (
        <div className="my-12 text-center text-red-500">{fetchState.error}</div>
      );
    }

    return (
      <>
        <CardHeader className="p-2 md:p-6">
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="border-none">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <Field name="Date">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          disabled={form.formState.isSubmitting}
                          variant="outline"
                          className={twMerge(
                            form.formState.errors.date && `shake-animation`,
                            'w-full justify-start text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Select a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </Field>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <Field name="Amount">
                    <div className="flex flex-row">
                      <Toggle
                        disabled={form.formState.isSubmitting}
                        aria-label="Toggle italic"
                        className={twMerge(
                          form.formState.errors.amount && `shake-animation`,
                          'rounded-l mr-0 rounded-r-none h-9 border px-3 data-[state=on]:bg-red-500 data-[state=off]:bg-green-500 data-[state=on]:text-primary data-[state=off]:text-primary'
                        )}
                        onClick={() => setAmountIsNegative(!amountIsNegative)}
                        pressed={amountIsNegative}
                      >
                        {amountIsNegative ? (
                          <MinusIcon className="h-4 w-2.5" />
                        ) : (
                          <PlusIcon className="h-4 w-2.5" />
                        )}
                      </Toggle>
                      <Input
                        disabled={form.formState.isSubmitting}
                        inputMode="decimal"
                        type="number"
                        step="any"
                        className={twMerge(
                          form.formState.errors.amount && `shake-animation`,
                          'rounded-l-none h-9 ml-0'
                        )}
                        {...field}
                        onChange={(n) => {
                          onAmountChange(n.target.valueAsNumber);
                        }}
                      />
                    </div>
                  </Field>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <Field name="Owner">
                    <Selection
                      value={field.value}
                      onChange={field.onChange}
                      options={fetchState.owners}
                      {...{
                        disabled: form.formState.isSubmitting,
                        className: 'rounded-md w-full overscroll-contain mb-4',
                      }}
                    />
                  </Field>
                )}
              />
              <FormField
                name="type"
                render={({ field }) => (
                  <Field name="Type">
                    <Selection
                      value={field.value}
                      onChange={field.onChange}
                      options={fetchState.categories}
                      {...{
                        disabled: form.formState.isSubmitting,
                        className: 'rounded-md w-full overscroll-contain mb-4',
                      }}
                    />
                  </Field>
                )}
              />
            </div>
            <div>
              <FormField
                name="description"
                render={({ field }) => (
                  <Field name="Description">
                    <Textarea
                      disabled={form.formState.isSubmitting}
                      onChange={field.onChange}
                      value={field.value}
                      className={twMerge(
                        'pb-0 mb-0',
                        form.formState.errors.description && `shake-animation`
                      )}
                    />
                  </Field>
                )}
              />
            </div>
            <CardFormFooter
              isSubmitting={form.formState.isSubmitting}
              isSubmittedSuccessfully={form.formState.isSubmitSuccessful}
              submitted={form.formState.isSubmitted}
              isError={isError}
            />
            {addedPayments.length > 0 && !editValues && (
              <div className="flex flex-col justify-center align-middle text-muted-foreground">
                <div className="text-center text-sm font-medium mb-1">
                  Added entries:
                </div>
                <div className="text-sm overflow-y-scroll">
                  <PaymentsRecap entries={addedPayments} limitedSpace />
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </>
    );
  };

  return (
    <Form {...form}>
      <Card className="p-0 md:p-2">
        <Loading loading={fetchState.loading}>{cardContent()}</Loading>
      </Card>
    </Form>
  );
}

PaymentForm.defaultProps = {
  editValues: null,
};

export default PaymentForm;
