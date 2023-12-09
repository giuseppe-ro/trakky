import { Dashboard } from "@/app/dashboard/components/dashboard";
import { PageContainer } from "@/components/ui/page-container";
import { Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";

export default function DashboardPage() {
  const { payments, availableYears, selectedYear, setSelectedYear } =
    usePaymentData();

  return (
    <PageContainer>
      <Text title={"Dashboards"} />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <Dashboard
        dashboardProps={{
          data: payments,
          selectedYear: selectedYear,
        }}
      ></Dashboard>
    </PageContainer>
  );
}
