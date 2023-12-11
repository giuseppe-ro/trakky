"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentsOverview, PaymentOverview, OwnersOverview, OwnerOverview } from "@/app/dashboard/components/overviews";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useEffect, useState } from "react";

import { Payment } from "@/infrastructure/payment";
import {
  getMonthlyOwnersSummariesForYear,
  getMonthlyPaymentsSummariesForYear, getYearlyOwnersSummaries,
  getYearlyPaymentsSummaries
} from "@/lib/summaries";
import { Budget, fetchBudgets } from "@/infrastructure/budget.tsx";
import Spinner from "@/components/ui/spinner.tsx";
import { FadeLeft } from "@/components/animations/fade.tsx";
import { SubTitle } from "@/components/ui/text.tsx";

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
  const [paymentOverviews, setPaymentOverviews] = useState<PaymentOverview[]>([]);
  const [ownersOverview, setOwnersOverview] = useState<OwnerOverview[]>([]);

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
      setPaymentOverviews(getYearlyPaymentsSummaries(dashboardProps.data, budgets));
      setOwnersOverview(getYearlyOwnersSummaries(dashboardProps.data));
    } else if (
      budgets &&
      dashboardProps.selectedYear !== null &&
      dashboardProps.data
    ) {
      const filteredPayments = dashboardProps.data.filter(
        (payment) =>
          new Date(payment.date).getFullYear() ===
          parseInt(dashboardProps.selectedYear ?? ""),
      );
      setFilteredData(filteredPayments);
      const budget = budgets.find(
        (item) =>
          new Date(item.date).getFullYear().toString() ===
          dashboardProps.selectedYear,
      );

      setOwnersOverview(getMonthlyOwnersSummariesForYear(filteredPayments));

      if (budget) {
        setPaymentOverviews(getMonthlyPaymentsSummariesForYear(filteredPayments, budget));
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
              <div className="md:grid md:grid-cols-2">
                <div>
                  <SubTitle title={"Expenses"} />
                  <PaymentsOverview data={paymentOverviews} />
                </div>
                <div>
                  <SubTitle title={"Users Comparison"} />
                  <OwnersOverview data={ownersOverview} />
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeLeft>
      </TabsContent>
    </Tabs>
  );
}
