/* eslint-disable @typescript-eslint/no-explicit-any */
import { CalendarIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Selection } from '@/components/ui/select';
import { Button } from '../button';
import { Calendar } from '../calendar';
import { Field, FormField } from '../form';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Toggle } from '../toggle';
import { Input } from '../input';
import { Textarea } from '../textarea';
import Switch from '../switch';

interface FieldProps {
  name: string;
  title: string;
  form: UseFormReturn<z.infer<any>>;
}

export function CalendarField({ form, name, title }: FieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Field name={title}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                disabled={
                  form.formState.isSubmitting ||
                  form.formState.isSubmitSuccessful
                }
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
  );
}

interface NumericFieldProps extends FieldProps {
  amountIsNegative?: boolean;
  setAmountIsNegative?: (value: boolean) => void;
}

export function NumericField({
  form,
  name,
  title,
  amountIsNegative,
  setAmountIsNegative,
  ...props
}: NumericFieldProps) {
  function onAmountChange(amount: number) {
    if (setAmountIsNegative && amount < 0) {
      setAmountIsNegative(true);
    }

    form.setValue(name, amount);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Field name={title}>
          <div className="flex flex-row">
            {setAmountIsNegative && (
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
            )}
            <Input
              disabled={form.formState.isSubmitting}
              inputMode="decimal"
              type="number"
              step="any"
              className={twMerge(
                'h-9 ml-0',
                form.formState.errors.amount && `shake-animation`,
                setAmountIsNegative && 'rounded-l-none'
              )}
              {...field}
              onChange={(n) => {
                onAmountChange(n.target.valueAsNumber);
              }}
              {...props}
            />
          </div>
        </Field>
      )}
    />
  );
}

NumericField.defaultProps = {
  amountIsNegative: false,
  setAmountIsNegative: null,
};

interface SelectionFieldProps extends FieldProps {
  options: string[];
  onChange?: (e: string) => void;
}

export function SelectionField({
  form,
  name,
  title,
  onChange,
  options,
}: SelectionFieldProps) {
  function onSelectionChange(
    e: string,
    field: ControllerRenderProps<any, string>
  ) {
    if (onChange) {
      onChange(e);
    }

    field.onChange(e);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <Field name={title}>
          <Selection
            value={field.value}
            onChange={(e) => onSelectionChange(e, field)}
            options={options}
            {...{
              disabled: form.formState.isSubmitting,
              className: 'rounded-md w-full overscroll-contain mb-4',
            }}
          />
        </Field>
      )}
    />
  );
}

SelectionField.defaultProps = {
  onChange: null,
};

export function TextInputField({ form, name, title }: FieldProps) {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <Field name={title}>
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
  );
}

interface SwitchFieldProps extends FieldProps {
  onChange?: (e: boolean, field: ControllerRenderProps<any, string>) => void;
}

export function SwitchField({ form, name, title, onChange }: SwitchFieldProps) {
  async function onSwitchChange(
    e: boolean,
    field: ControllerRenderProps<any, string>
  ) {
    if (onChange) {
      onChange(e, field);
    }

    field.onChange(e);
  }

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => (
        <Field name={title}>
          <div className="space-x-2">
            <div className="mt-4" />
            <Switch
              checked={field.value}
              onCheckedChange={(e) => onSwitchChange(e, field)}
            />
          </div>
        </Field>
      )}
    />
  );
}

SwitchField.defaultProps = {
  onChange: null,
};
