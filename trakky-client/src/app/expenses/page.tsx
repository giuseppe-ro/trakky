import { PageContainer } from "@/components/ui/page-container";
import { ExpensesTable } from "./components/table";
import { Title } from "@/components/ui/title.tsx";
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
      <Title title={"Expenses"} />
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
