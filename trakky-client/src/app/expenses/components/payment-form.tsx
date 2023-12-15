"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Selection } from "@/components/ui/select.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import React from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  AddPayments,
  EditPayment,
  Payment,
} from "@/infrastructure/payment.tsx";
import { fetchOwners } from "@/infrastructure/owner.tsx";
import { fetchTypes } from "@/infrastructure/transaction-type.tsx";
import { toast } from "@/components/ui/use-toast.ts";

let types: string[] = [];
let owners: string[] = [];

fetchOwners()
  .then((o) => o.map((owner) => owner.name))
  .then((o) => (owners = o));

fetchTypes()
  .then((t) => t.map((type) => type.name))
  .then((t) => (types = t));

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    return { message: "" };
  }
  if (issue.code === z.ZodIssueCode.custom) {
    return { message: "" };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

const formSchema = z.object({
  id: z.number().optional(),
  owner: z.string().refine((val) => owners.includes(val)),
  type: z.string().refine((val) => types.includes(val)),
  date: z.date(),
  amount: z.number().refine((val) => val !== 0, {
    message: "cannot be 0",
  }),
  description: z.string().refine((val) => val.length <= 50 && val.length > 0),
});

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export function PaymentForm({
  title,
  refresh,
  editValues,
}: {
  title: string;
  refresh: (flushPaymentsBeforeRefresh: boolean) => void;
  editValues?: Payment;
}) {
  const [isError, setIsError] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  console.log("editValues", editValues);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: editValues?.id === undefined ? undefined : Number(editValues?.id),
      date:
        editValues?.date === undefined
          ? new Date()
          : new Date(editValues?.date),
      owner: editValues?.owner ?? owners[0],
      type: editValues?.type ?? types[0],
      amount: editValues?.amount ?? 0,
      description: editValues?.description ?? "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsError(false);
    console.log(values);

    const success =
      editValues === undefined
        ? await AddPayments(values as unknown as Payment[])
        : await EditPayment(values as unknown as Payment);

    if (success) {
      setIsSuccess(true);
      if (editValues === undefined) {
        form.resetField("amount");
        form.resetField("description");
        form.setFocus("amount");

        toast({
          title: "Transactions has been added!",
          className: "bg-green-600",
        })
      }
      setTimeout(() => {
        refresh(false);
        setIsSuccess(false);
      }, 1000);
    } else {
      toast({
        title: "Error: could not save transaction!",
        className: "bg-red-600",
      })
      setIsError(true);
    }
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
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <Field name={"Date"}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
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

              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <Field name={"Amount"}>
                      <Input
                        inputMode="decimal"
                        type="number"
                        step="any"
                        className={cn(
                          form.formState.errors.amount && `shake-animation`,
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
                  name="owner"
                  render={({ field }) => (
                    <Field name={"Owner"}>
                      <Selection
                        value={field.value}
                        onChange={field.onChange}
                        options={owners}
                        {...{
                          className:
                            "rounded-md w-full overscroll-contain mb-4",
                        }}
                      />
                    </Field>
                  )}
                />
                <FormField
                  name="type"
                  render={({ field }) => (
                    <Field name={"Type"}>
                      <Selection
                        value={field.value}
                        onChange={field.onChange}
                        options={types}
                        {...{
                          className:
                            "rounded-md w-full overscroll-contain mb-4",
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
                    <Field name={"Description"}>
                      <Textarea
                        onChange={field.onChange}
                        value={field.value}
                        className={cn(
                          "pb-0 mb-0",
                          form.formState.errors.description &&
                            `shake-animation`,
                        )}
                      ></Textarea>
                    </Field>
                  )}
                />
              </div>
              <CardFooter className="flex flex-col justify-between">
                {!form.formState.isSubmitting && (
                  <Button
                    disabled={!isError && isSuccess}
                    type="submit"
                    variant="outline"
                    className={cn(
                      "w-full border transition-none border-green-500 hover:bg-green-500",
                      form.formState.isSubmitted &&
                        isError &&
                        "border-red-700 hover:border-red-950 hover:bg-red-700",
                      isSuccess &&
                        !isError &&
                        "border border-green-500 hover:border-green-950 bg-green-500 hover:bg-green-500",
                    )}
                  >
                    {isSuccess && !isError ? "Saved" : "Save"}
                  </Button>
                )}
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}

function Field({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <FormItem className="text-center">
      <FormLabel>{name}</FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  );
}
