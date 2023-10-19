"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview, Summary } from "@/app/dashboard/components/overview";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { Selection } from "@/components/ui/select";
import { useEffect, useState } from "react";

import { Payment } from "@/infrastructure/payment";
import {
  getAvailableYears,
  getMonthlySummariesForYear,
  getYearlySummaries,
} from "@/lib/summaries";
import { Budget, fetchBudgets } from "@/infrastructure/budget.tsx";
import Spinner from "@/components/ui/spinner.tsx";

export function Dashboard({
  data,
  selection,
  ...props
}: {
  data: Payment[];
  selection?: string;
}) {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    fetchBudgets().then((data) => {
      setBudgets(data);
    });
  }, []);

  const availableYears = getAvailableYears(data);
  availableYears.push("All");
  const [filteredData, setFilteredData] = useState<Payment[]>([]);

  const [selectedYear, setSelectedYear] = useState<string>(
    selection ? selection : availableYears[0],
  );

  const [summary, setSummary] = useState<Summary[]>([]);

  useEffect(() => {
    if (selection) setSelectedYear(selection);
  }, [selection]);

  useEffect(() => {
    if (selectedYear === "All") {
      setFilteredData(data);
      setSummary(getYearlySummaries(data, budgets));
    } else {
      const newData = data.filter(
        (payment) =>
          new Date(payment.date).getFullYear() === parseInt(selectedYear),
      );
      setFilteredData(newData);
      const budget = budgets.find(
        (item) => new Date(item.date).getFullYear().toString() === selectedYear,
      );

      if (budget) {
        setSummary(getMonthlySummariesForYear(newData, budget));
      }
    }
  }, [selectedYear, data]);

  return filteredData.length === 0 ? (
    selection === undefined ? (
      <Spinner></Spinner>
    ) : (
      <></>
    )
  ) : (
    <div {...props}>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
          {selectedYear && selection === undefined && (
            <Selection
              value={selectedYear}
              onChange={setSelectedYear}
              options={availableYears}
              {...{
                className:
                  "rounded-md w-full overscroll-contain mb-4 sticky top-20 bg-gray-950 z-50",
              }}
            />
          )}
          {filteredData.length === 0 && (
            <div className="container h-full mt-16">
              <Spinner />
            </div>
          )}
          <Card className="p-0">
            <CardHeader>
              <CardTitle
                title={"Overview"}
                className="flex flex-col items-center w-full justify-cente lg:m-6 invisible lg:visible"
              >
                <p className="lg:m-6 text-2xl">{selectedYear} Overview</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={summary} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
