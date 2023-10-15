"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "@tanstack/react-table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export function SummaryCard({
  title,
  contentText,
  contentSubText,
}: {
  title: string;
  contentText: string;
  contentSubText?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{contentText}</div>
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
  const total: number = totalAmounts.reduce(
    (total, currentAmount) => total + currentAmount,
    0,
  );

  const formattedTotal = formatCurrency(total);

  const partialTotalAmounts: number[] = table
    .getFilteredRowModel()
    .rows.map((r) => parseFloat(r.getValue("amount")));
  const partialTotal: number = partialTotalAmounts.reduce(
    (total, currentAmount) => total + currentAmount,
    0,
  );

  const formattedPartialTotal = formatCurrency(partialTotal);

  const previousYearTotal = totalsPerYear.find(
    (t) => t.date === parseInt(selectedYear) - 1,
  );

  const change =
    previousYearTotal === undefined || previousYearTotal.amount === 0
      ? 0
      : Math.round(
          ((total - previousYearTotal.amount) / previousYearTotal.amount) *
            100 *
            100,
        ) / 100;

  const changePercentage =
    isFinite(change) && change !== 0
      ? change > 0
        ? "+" + change + "% compared to last year"
        : change + "% compared to last year"
      : "";

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
        <div className="grid gap-4 grid-cols-2">
          <SummaryCard
            title={"Total"}
            contentText={formattedTotal}
            contentSubText={changePercentage}
          />
          <SummaryCard
            title={"Partial Total"}
            contentText={formattedPartialTotal}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
