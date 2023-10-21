import { Dashboard } from "@/app/dashboard/components/dashboard";
import { PageContainer } from "@/components/ui/page-container";
import { Title } from "@/components/ui/title.tsx";
import { usePaymentData } from "@/lib/hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";

export default function DashboardPage() {
  const { payments, availableYears, selectedYear, setSelectedYear } =
    usePaymentData();

  return (
    <PageContainer>
      <Title title={"Dashboard"} />
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
