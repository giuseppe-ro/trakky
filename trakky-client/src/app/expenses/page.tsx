import { PageContainer } from "@/components/ui/page-container";
import { ExpensesTable } from "./components/table";
import { Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";

export default function ExpensesPage() {
  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  return (
    <PageContainer>
      <Text title={"Expenses"} />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <ExpensesTable
        dataTableProps={{
          data: payments,
          refreshData: refreshData,
          selectedYear: selectedYear,
        }}
      />
    </PageContainer>
  );
}
