"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "@tanstack/react-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { FadeLeft } from "@/components/animations/fade.tsx";
import React from "react";

function SummaryCard({
  title,
  contentText,
  contentSubText,
  children,
}: {
  title: string;
  contentText?: string;
  contentSubText?: string;
  children?: React.ReactNode;
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
        <div className="text-xs text-muted-foreground">{contentSubText}{children}</div>
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
            >
              {ownerBalances.map((balance: OwnerBalance, index: number) =>
                <div className="text-sm text-left" key={`${index}-accordion`}>
                  <div className="flex" key={`${index}-wrapper`}>
                    <div className="mr-2 min-w-[60px] text-muted-foreground font-bold" key={`${index}-owner`}>{balance.owner}:</div>
                    <div className="flex text-muted-foreground" key={`${index}-amount`}>{formatCurrency(balance.amount)}
                      {balance.difference && <span className="ml-2 text-slate-600 hidden xs:visible" key={`${index}-difference`}>
                        {balance.difference}
                      </span>}
                    </div>

                  </div>
                </div>
              )}
            </SummaryCard>
          </FadeLeft>
        </TabsContent>
      </Tabs>
    )
  );
}
