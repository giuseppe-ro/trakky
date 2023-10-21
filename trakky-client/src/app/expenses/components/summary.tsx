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

  const formattedTotal = formatCurrency(totalAmount);

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
          <div
            className="grid gap-2 md:gap-4 grid-cols-2"
            data-aos="fade-left"
            data-aos-easing="ease-out-cubic"
            data-aos-duration="500"
            data-aos-mirror="true"
          >
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
    )
  );
}
