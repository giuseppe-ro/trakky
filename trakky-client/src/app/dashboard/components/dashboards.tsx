"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  PaymentsOverview,
  OwnersOverview,
  ExpensesPieChart
} from "@/app/dashboard/components/overviews.tsx";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { Payment } from "@/infrastructure/payment";
import Spinner from "@/components/ui/spinner.tsx";
import { FadeLeft } from "@/components/animations/fade.tsx";
import { SubTitle } from "@/components/ui/text.tsx";
import { useDashboards } from "@/lib/hooks/dashboards-hooks.ts";

export interface DashboardProps {
  data: Payment[] | null;
  selectedYear: string | null;
}

export function Dashboards({
  dashboardProps,
  ...props
}: {
  dashboardProps: DashboardProps;
}) {

  const {
    filteredData,
    paymentOverviews,
    ownersOverview,
    expensesBreakdown
  } = useDashboards(dashboardProps);

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
            <CardContent className="pl-2">
              <div className="sm:grid sm:grid-cols-2">
                <div>
                  <SubTitle title={"Expenses"} />
                  <PaymentsOverview data={paymentOverviews} />
                </div>
                <div className="mt-4 md:mt-0">
                  <SubTitle title={"Users Comparison"} />
                  <OwnersOverview data={ownersOverview} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <SubTitle title={"Breakdown"} />
                <ExpensesPieChart data={expensesBreakdown}></ExpensesPieChart>
            </CardContent>
          </Card>
        </FadeLeft>
      </TabsContent>
    </Tabs>
  );
}
