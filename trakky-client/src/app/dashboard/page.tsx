import { PageContainer } from "@/components/ui/page-container";
import { SubTitle, Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks/page-hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";
import { useDashboards } from "@/lib/hooks/dashboards-hooks.ts";
import Spinner from "@/components/ui/spinner.tsx";
import { Tabs, TabsContent } from "@/components/ui/tabs.tsx";
import { FadeLeft } from "@/components/animations/fade.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { ExpensesPieChart, OwnersOverview, PaymentsOverview } from "@/app/dashboard/components/dashboards.tsx";

export default function DashboardPage() {
  const { payments, availableYears, selectedYear, setSelectedYear } =
    usePaymentData();

  const {
    filteredData,
    paymentOverviews,
    ownersOverview,
    expensesBreakdown
  } = useDashboards({data: payments, selectedYear: selectedYear});

  return (
    <PageContainer>
      <Text title={"Dashboards"} />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      {
        filteredData === null ? (
          selectedYear === undefined ? (
            <Spinner />
          ) : (
            <></>
          )
        ) : (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4" tabIndex={-1}>
              <FadeLeft>
                <Card className="p-0">
                  <CardContent className="pl-2">
                    <div className="sm:grid sm:grid-cols-2">
                      <div>
                        <SubTitle title={"Expenses"} />
                        <PaymentsOverview data={paymentOverviews} />
                      </div>
                      <div className="mt-4 sm:mt-0">
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
          </Tabs> )
      }
    </PageContainer>
  );
}
