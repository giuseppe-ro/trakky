"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/app/dashboard/components/overview";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { Selection } from "@/components/ui/select";
import { useEffect, useState } from "react";

import {
  getAvailableYears,
  getMonthlySummaries,
  getYearlySummaries,
} from "@/lib/utils";
import { budgets } from "@/lib/data";
import { Payment } from "@/infrastructure/payment";
import Loading from "@/app/loading";

export function Dashboard({
  data,
  selection,
  ...props
}: {
  data: Payment[];
  selection?: string;
}) {
  const availableYears = getAvailableYears(data);
  availableYears.push("All");
  const [filteredData, setFilteredData] = useState<Payment[]>([]);

  const [selectedYear, setSelectedYear] = useState<string>(
    selection ? selection : availableYears[0],
  );

  useEffect(() => {
    if (selection) setSelectedYear(selection);
  }, [selection]);

  useEffect(() => {
    if (selectedYear === "All") setFilteredData(data);
    else {
      setFilteredData(
        data.filter(
          (payment) => payment.date.getFullYear() === parseInt(selectedYear),
        ),
      );
    }
  }, [selectedYear]);

  const summary =
    selectedYear === "All"
      ? getYearlySummaries(filteredData, budgets)
      : getMonthlySummaries(filteredData, budgets);

  return filteredData.length === 0 ? (
    <Loading />
  ) : (
    <div {...props}>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          <Card className="p-0">
            <CardHeader>
              <CardTitle
                title={"Overview"}
                className="flex flex-col items-center w-full justify-center"
              >
                {selection === undefined && (
                  <Selection
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={availableYears}
                    {...{ className: "rounded-t-md w-full" }}
                  />
                )}
                <p className="m-6 text-2xl">{selectedYear} Overview</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={summary} />
            </CardContent>
          </Card>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {/*<Card>*/}
            {/*  <CardHeader>*/}
            {/*    <CardTitle className="flex flex-col items-center w-full justify-center">*/}
            {/*      <p className="m-6 text-2xl">Full Overview</p>*/}
            {/*    </CardTitle>*/}
            {/*  </CardHeader>*/}
            {/*  <CardContent className="pl-2">*/}
            {/*    <Overview data={summaries} />*/}
            {/*  </CardContent>*/}
            {/*</Card>*/}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
