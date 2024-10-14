'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Field, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import React from 'react';
import { resultToast } from '@/components/ui/use-toast';
import {
  firstOfTheMonthDateString,
  nextMonthDateString,
} from '@/lib/text-formatter';
import { errorMessage } from '@/components/ui/table/form-error-message';
import { Budget } from '@/models/dtos';
import { CalendarIcon } from 'lucide-react';
import { Client } from '@/infrastructure/client-injector';
import { Endpoint } from '@/constants';

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

interface BudgetFormProps {
  title: string;
  refresh: (flushBeforeRefresh: boolean) => void;
  existingDates: Date[];
  editValues?: Budget;
}

export function BudgetForm({
  title,
  refresh,
  existingDates,
  editValues,
}: BudgetFormProps) {
  const [existing] = React.useState<Date[]>(existingDates);
  const formSchema = z.object({
    date: z.date(),
    budget: z.number().refine((val) => val > 0, {
      message: 'cannot be 0 or negative',
    }),
    maxBudget: z.number().refine((val) => val > 0, {
      message: 'cannot be 0 or negative',
    }),
  });

  const [isError, setIsError] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date:
        editValues?.date === undefined || editValues?.date === null
          ? new Date()
          : new Date(editValues?.date),
      budget: editValues?.budget === undefined ? 0 : Number(editValues?.budget),
      maxBudget:
        editValues?.maxBudget === undefined ? 0 : Number(editValues?.maxBudget),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsError(false);
    form.clearErrors();

    const budget = values as unknown as Budget;

    const reset = (timeout: number) => {
      setTimeout(() => {
        form.reset({}, { keepValues: true });
        form.setValue(
          'date',
          new Date(nextMonthDateString(new Date(budget.date)))
        );
        existing.push(
          new Date(firstOfTheMonthDateString(new Date(budget.date)))
        );
        refresh(true);
      }, timeout);

      clearTimeout(timeout);
    };

    if (!editValues) {
      const budgetExists = existing.some(
        (date) =>
          date.getTime() ===
          new Date(firstOfTheMonthDateString(new Date(budget.date))).getTime()
      );

      if (budgetExists) {
        form.setError('date', {
          type: 'manual',
          message: 'Budget already exists for this date',
        });
        // reset(3000);
        return;
      }

      const { data, error } = await Client.Post(Endpoint.Budgets, [budget]);
      if (error || !data) {
        errorMessage(setIsError, error?.error);
        return;
      }
    } else {
      budget.id = editValues.id;
      const { data, error } = await Client.Put(Endpoint.Budgets, budget);

      if (error || !data) {
        errorMessage(setIsError, error?.error);
        return;
      }
    }

    resultToast({
      isError: false,
      message: 'Transaction saved',
    });

    reset(1000);
  }

  return (
    <div>
      <Form {...form}>
        <Card className="p-0 md:p-2">
          <CardHeader className="p-2 md:p-6">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="border-none">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1">
                <FormField
                  disabled={
                    form.formState.isSubmitting ||
                    form.formState.isSubmitSuccessful
                  }
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <Field name="Date">
                      <Popover>
                        <PopoverTrigger
                          asChild
                          className={twMerge(
                            form.formState.errors.date && `shake-animation`
                          )}
                        >
                          <Button
                            disabled={
                              form.formState.isSubmitting ||
                              form.formState.isSubmitSuccessful
                            }
                            variant="outline"
                            className={twMerge(
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
                            onSelect={(e) => {
                              form.clearErrors('date');
                              field.onChange(e);
                            }}
                            initialFocus
                            disabled={
                              form.formState.isSubmitting ||
                              form.formState.isSubmitSuccessful
                            }
                          />
                        </PopoverContent>
                      </Popover>
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <Field name="Budget">
                      <Input
                        disabled={
                          form.formState.isSubmitting ||
                          form.formState.isSubmitSuccessful
                        }
                        inputMode="decimal"
                        type="number"
                        step="any"
                        min={0}
                        className={twMerge(
                          form.formState.errors.budget && `shake-animation`
                        )}
                        {...field}
                        onChange={(n) => {
                          field.onChange(n.target.valueAsNumber);
                        }}
                      />
                    </Field>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxBudget"
                  render={({ field }) => (
                    <Field name="Max Budget">
                      <Input
                        disabled={
                          form.formState.isSubmitting ||
                          form.formState.isSubmitSuccessful
                        }
                        inputMode="decimal"
                        type="number"
                        step="any"
                        min={0}
                        className={twMerge(
                          form.formState.errors.maxBudget && `shake-animation`
                        )}
                        {...field}
                        onChange={(n) => {
                          field.onChange(n.target.valueAsNumber);
                        }}
                      />
                    </Field>
                  )}
                />
              </div>
              <CardFormFooter
                isSubmitting={form.formState.isSubmitting}
                submitted={form.formState.isSubmitted}
                isSubmittedSuccessfully={form.formState.isSubmitSuccessful}
                isError={isError}
              />
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}

BudgetForm.defaultProps = {
  editValues: null,
};

export default BudgetForm;
