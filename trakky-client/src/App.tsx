import "./App.css";
import { PageContainer } from "@/components/ui/page-container.tsx";
import { ExpensesTable } from "@/app/expenses/components/table.tsx";
import { Dashboards } from "@/app/dashboard/components/dashboards.tsx";
import { Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";
import { useTable } from "@/lib/table-hooks.ts";
import { Summary } from "@/app/expenses/components/summary.tsx";
import { Payment } from "@/infrastructure/payment.tsx";
import { useEffect, useState } from "react";

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
    const test = table
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

      setFilteredPayments(test);
  }, [table
    .getFilteredRowModel()]);


  return (
    <PageContainer>
      <Text title={"Home"} />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <Summary
        table={table}
        totalsPerYear={totalsPerYear}
        selectedYear={selectedYear ?? ""}
      />
      <div className="lg:grid gap-4 lg:grid-cols-5">

        <ExpensesTable
          expensesTableProps={{
            table,
            onDeleteConfirmed,
            onPaymentEdited,
            onRefresh,
          }}
          {...{ className: "lg:col-span-2" }}

        />
      <div className={"lg:col-span-3 mt-6 lg:mt-0"}>
        <Dashboards
          dashboardProps={{
            data: filteredPayments,
            selectedYear: selectedYear,
          }}
          {...{ className: "" }}
        />
      </div>
      </div>
    </PageContainer>
  );
}

export default App;
