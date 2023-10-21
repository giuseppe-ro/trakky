"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview, Summary } from "@/app/dashboard/components/overview";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { Payment } from "@/infrastructure/payment";
import {
  getMonthlySummariesForYear,
  getYearlySummaries,
} from "@/lib/summaries";
import { Budget, fetchBudgets } from "@/infrastructure/budget.tsx";
import Spinner from "@/components/ui/spinner.tsx";
import { FadeLeft } from "@/components/animations/fade.tsx";

export interface DashboardProps {
  data: Payment[] | null;
  selectedYear: string | null;
}

export function Dashboard({
  dashboardProps,
  ...props
}: {
  dashboardProps: DashboardProps;
}) {
  const [budgets, setBudgets] = useState<Budget[] | null>(null);
  const [filteredData, setFilteredData] = useState<Payment[] | null>(null);
  const [summary, setSummary] = useState<Summary[]>([]);

  useEffect(() => {
    fetchBudgets().then((data) => {
      setBudgets(data);
    });
  }, []);

  useEffect(() => {
    if (
      dashboardProps.selectedYear === "All" &&
      budgets &&
      dashboardProps.data
    ) {
      setFilteredData(dashboardProps.data);
      setSummary(getYearlySummaries(dashboardProps.data, budgets));
    } else if (
      budgets &&
      dashboardProps.selectedYear !== null &&
      dashboardProps.data
    ) {
      const newData = dashboardProps.data.filter(
        (payment) =>
          new Date(payment.date).getFullYear() ===
          parseInt(dashboardProps.selectedYear ?? ""),
      );
      setFilteredData(newData);
      const budget = budgets.find(
        (item) =>
          new Date(item.date).getFullYear().toString() ===
          dashboardProps.selectedYear,
      );

      if (budget) {
        setSummary(getMonthlySummariesForYear(newData, budget));
      }
    } else {
      setFilteredData([]);
    }
  }, [dashboardProps.selectedYear, dashboardProps.data]);

  return filteredData === null ? (
    dashboardProps.selectedYear === undefined ? (
      <Spinner />
    ) : (
      <></>
    )
  ) : (
    <Tabs defaultValue="overview" className="space-y-4" {...props}>
      <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
        <FadeLeft>
          <Card className="p-0">
            <CardHeader>
              <CardTitle
                title={"Overview"}
                className="flex flex-col items-center w-full justify-cente lg:m-6 invisible lg:visible"
              >
                <p className="lg:m-6 text-2xl">
                  {dashboardProps.selectedYear} Overview
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview data={summary} />
            </CardContent>
          </Card>
        </FadeLeft>
      </TabsContent>
    </Tabs>
  );
}
