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

const types = ["Food", "Transport", "Entertainment", "General"];
const owners = ["Ray", "Micia"];

const formSchema = z.object({
  owner: z.string().refine((val) => owners.includes(val)),
  type: z.string().refine((val) => types.includes(val)),
  date: z.date().refine((val) => val <= new Date()),
  amount: z.string().refine((val) => parseFloat(val) > 0),
});

export function PaymentForm() {
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner: owners[0],
      type: types[0],
      amount: "0",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitted(true);

    form.resetField("amount");
    form.setFocus("amount");
    console.log(values);

    setTimeout(() => {
      setSubmitted(false);
    }, 1000);
  }

  return (
    <div>
      <Form {...form}>
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
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
                      <Input type="number" step="any" {...field} />
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
              <div className="grid grid-cols-2 gap-4"></div>
              <CardFooter className="flex justify-between">
                <Button
                  type="submit"
                  variant="outline"
                  className={cn(
                    "w-full border transition-none border-green-700 hover:bg-green-700",
                    submitted &&
                      "border border-green-700 hover:border-green-950 bg-green-700 hover:bg-green-700",
                  )}
                >
                  {submitted ? "Added" : "Add"}
                </Button>
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
