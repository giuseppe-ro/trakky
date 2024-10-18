'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardFormFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import { resultToast } from '@/components/ui/use-toast';
import {
  firstOfTheMonthDateString,
  nextMonthDateString,
} from '@/lib/text-formatter';
import { errorMessage } from '@/components/ui/table/form-error-message';
import { Budget } from '@/models/dtos';
import { Client } from '@/infrastructure/client-injector';
import { Endpoint } from '@/constants';
import { CalendarField, NumericField } from '@/components/ui/table/form-fields';

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
                <CalendarField form={form} name="date" title="Date" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumericField
                  form={form}
                  name="budget"
                  title="Budget"
                  {...{ inputMode: 'decimal' }}
                />
                <NumericField
                  form={form}
                  name="maxBudget"
                  title="Max Budget"
                  {...{ inputMode: 'decimal' }}
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
