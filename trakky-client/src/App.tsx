import "./App.css";
import { ExpensesTable } from "@/app/expenses/components/table.tsx";
import { SubTitle, Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks/page-hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";
import { useTable } from "@/lib/hooks/table-hooks.ts";
import { Summary } from "@/app/expenses/components/summary.tsx";
import { Payment } from "@/infrastructure/payment.tsx";
import { useEffect, useState } from "react";
import { ExpensesPieChart, UsersDashboard, ExpensesDashboard } from "@/app/dashboard/components/dashboards.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { useDashboards } from "@/lib/hooks/dashboards-hooks.ts";
import { Containers } from "@/components/ui/containers.tsx";

function App() {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const {
    totalsPerYear,
    table,
    onDeleteConfirmed,
    onPaymentEdited,
    onRefresh,
  } = useTable({
    data: payments,
    selectedYear,
    refreshData,
  })

  useEffect(() => {

    const filteredPayments = table
      .getFilteredRowModel()
      .rows
      .map((row) => (
        {
          id: row.getValue("date"),
          amount: row.getValue("amount"),
          type: row.getValue("type"),
          owner: row.getValue("owner"),
          description: row.getValue("description"),
          date: row.getValue("date")
        }) as Payment);

    setFilteredPayments(filteredPayments);
  }, [table.getFilteredRowModel()]);

  const {
    paymentOverviews,
    ownersOverview,
    expensesBreakdown
  } = useDashboards({ data: filteredPayments, selectedYear });

  return (
    <>
      <Text title={"Home"} />
         <YearSelection
           availableYears={availableYears}
           selectedYear={selectedYear}
           onYearChange={setSelectedYear}
         />
      <Containers>
        <Summary
          table={table}
          totalsPerYear={totalsPerYear}
          selectedYear={selectedYear ?? ""}
        />

      </Containers>
      <div className="lg:grid gap-4 lg:grid-cols-2 mt-4">
          <ExpensesTable
            expensesTableProps={{
              table,
              onDeleteConfirmed,
              onPaymentEdited,
              onRefresh,
              page: "home",
            }}
            {...{ className: "lg:col-span-1" }}
          />

        <div className={"lg:col-span-1 pt-4 md:pt-0 overflow-x-scroll"}>
          <SubTitle title={"Breakdown"} />
          <ExpensesPieChart data={expensesBreakdown}></ExpensesPieChart>
        </div>
      </div>
      <Card className="mt-0">
        <CardContent className="pl-4">
          <div className="sm:grid gap-4 sm:grid-cols-2">
            <div>
              <SubTitle title={"Expenses"} />
              <ExpensesDashboard data={paymentOverviews} />
            </div>
            <div className="mt-4 sm:mt-0">
              <SubTitle title={"Users Comparison"} />
              <UsersDashboard data={ownersOverview} />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default App;
