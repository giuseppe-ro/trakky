import "./App.css";
import { PageContainer } from "@/components/ui/page-container.tsx";
import { ExpensesTable } from "@/app/expenses/components/table.tsx";
import { Dashboard } from "@/app/dashboard/components/dashboard.tsx";
import { Title } from "@/components/ui/title.tsx";
import { usePaymentData } from "@/lib/hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";

function App() {
  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  return (
    <PageContainer>
      <Title title={"Overview"} />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <div className="lg:grid gap-4 lg:grid-cols-9">
        <ExpensesTable
          dataTableProps={{
            data: payments,
            refreshData: refreshData,
            selectedYear: selectedYear,
          }}
          {...{ className: "lg:col-span-5" }}
        />
        <Dashboard
          dashboardProps={{
            data: payments,
            selectedYear: selectedYear,
          }}
          {...{ className: "lg:col-span-4 mt-6 lg:mt-0" }}
        />
      </div>
    </PageContainer>
  );
}

export default App;
