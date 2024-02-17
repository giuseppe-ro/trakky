import { CustomTable } from '@/components/ui/table/table';
import { SubTitle, Title } from '@/components/ui/text';
import {
  usePaymentData,
  useFilteredPayments,
} from '@/lib/hooks/payments-hooks';
import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { FadeLeft, FadeUp } from '@/components/ui/animations/fade';
import Dashboards from '@/components/dashboards/dashboards';
import useDashboard from '@/lib/hooks/use-dashboard';

function DashboardPage() {
  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const { table } = usePaymentsTable({
    data: payments,
    selectedYear,
    refreshData,
  });

  const filteredPayments = useFilteredPayments(table);

  const { paymentOverviews, ownersOverview, expensesBreakdown } = useDashboard({
    data: filteredPayments,
    selectedYear,
  });

  return (
    <>
      <Title title="Dashboards" />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <FadeLeft>
        <div className="mt-6 text-center" aria-label="Filters">
          <SubTitle title="Filters" />
          <CustomTable table={table} filtersOnly page="dashboard" />
        </div>
      </FadeLeft>
      <FadeUp>
        <Dashboards
          paymentOverviews={paymentOverviews}
          ownersOverview={ownersOverview}
          expensesBreakdown={expensesBreakdown}
        />
      </FadeUp>
    </>
  );
}

export default DashboardPage;
