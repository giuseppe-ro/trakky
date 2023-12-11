import { PageContainer } from "@/components/ui/page-container";
import { Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks/page-hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";
import { Dashboards } from "@/app/dashboard/components/dashboards.tsx";

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
      <Dashboards
        dashboardProps={{
          data: payments,
          selectedYear: selectedYear,
        }}
      />
    </PageContainer>
  );
}
