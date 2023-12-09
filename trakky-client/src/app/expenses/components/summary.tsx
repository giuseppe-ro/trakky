"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "@tanstack/react-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FadeLeft } from "@/components/animations/fade.tsx";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

function SummaryCard({
  title,
  contentText,
  contentSubText,
}: {
  title: string;
  contentText: string;
  contentSubText?: string;
}) {
  return (
    <Card className="border rounded-xl p-1 md:p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold">{contentText}</div>
        <p className="text-xs text-muted-foreground">{contentSubText}</p>
      </CardContent>
    </Card>
  );
}

function formatCurrency(total: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(total);
}

export type Total = {
  amount: number;
  date: number;
};

type OwnerBalance = {
  owner: string,
  amount: number,
  difference?: string
};

export function Summary<TData>({
  table,
  totalsPerYear,
  selectedYear,
}: {
  table: Table<TData>;
  totalsPerYear: Total[];
  selectedYear: string;
}) {

  const totalAmounts: number[] = table
    .getPreFilteredRowModel()
    .rows.map((r) => parseFloat(r.getValue("amount")));

  const totalAmount = totalAmounts.reduce(
    (total, currentAmount) => total + currentAmount,
    0,
  );

  const partialTotal: number = table
    .getFilteredRowModel()
    .rows.map((r) => parseFloat(r.getValue("amount")))
    .reduce((total, currentAmount) => total + currentAmount, 0);

  const previousYearTotal = totalsPerYear.find(
    (t) => t.date === parseInt(selectedYear) - 1,
  );

  const ownerBalances: OwnerBalance[] = [];

  table
    .getFilteredRowModel()
    .rows.map((r) => ({ amount: parseFloat(r.getValue("amount")), owner: r.getValue("owner") })).forEach(item => {
      const existingOwnerBalance = ownerBalances.find(balance => balance.owner === item.owner);
      if (existingOwnerBalance) {
        existingOwnerBalance.amount += item.amount;
      } else {
        ownerBalances.push({ owner: item.owner as string, amount: item.amount });
      }
    });

  ownerBalances
    .forEach(bal => bal.difference = (partialTotal / ownerBalances.length) - bal.amount <= 0.1 ? "" : `(-${formatCurrency((partialTotal / ownerBalances.length) - bal.amount)})`)

  console.log(ownerBalances)

  const change =
    previousYearTotal === undefined || previousYearTotal.amount === 0
      ? 0
      : Math.round(
        ((totalAmount - previousYearTotal.amount) /
          previousYearTotal.amount) *
        100 *
        100,
      ) / 100;

  const changePercentage =
    isFinite(change) && change !== 0
      ? change > 0
        ? "+" + change + "% from previous year"
        : change + "% from previous year"
      : "";

  return (
    totalAmount > 0 && (
      <Tabs defaultValue="overview" className="space-y-4 animate-fade">
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          <FadeLeft className="grid gap-2 md:gap-4 grid-cols-2">
            <SummaryCard
              title={"Total"}
              contentText={formatCurrency(totalAmount)}
              contentSubText={changePercentage}
            />
            <SummaryCard
              title={"Partial Total"}
              contentText={formatCurrency(partialTotal)}
            />
          </FadeLeft>
          <FadeLeft className="m-0 p-0">
            <Accordion className="mx-1 md:mb-2 md:mt-1" type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Total Breakdown</AccordionTrigger>
                <AccordionContent>
                  <div className="text-xl md:text-2xl font-bold mt-4">{""}</div>
                  {ownerBalances.map((balance: OwnerBalance, index: number) =>
                      <div className="text-sm text-left" key={`${index}-accordion`}>
                        <div className="grid grid-cols-[50px_minmax(50px,_1fr)_50px]" key={`${index}-wrapper`}>
                          <div className="mr-2" key={`${index}-owner`}>{balance.owner}:</div>
                          <div className="flex text-muted-foreground" key={`${index}-amount`}>{formatCurrency(balance.amount)}
                            {balance.difference && <div className="ml-2 text-slate-600" key={`${index}-difference`}>{balance.difference}</div>}
                          </div>
                        </div>
                      </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FadeLeft>
        </TabsContent>
      </Tabs>
    )
  );
}
