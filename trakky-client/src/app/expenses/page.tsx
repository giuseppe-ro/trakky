import { PageContainer } from "@/components/ui/page-container";
import { ExpensesTable } from "./components/table";
import { Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";
import { useTable } from "@/lib/table-hooks.ts";
import { Summary } from "@/app/expenses/components/summary.tsx";


export default function ExpensesPage() {
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

  return (
    <PageContainer>
      <Text title={"Expenses"} />
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
      <ExpensesTable
        expensesTableProps={{
          table,
          onDeleteConfirmed,
          onPaymentEdited,
          onRefresh,
        }}
      />
    </PageContainer>
  );
}
