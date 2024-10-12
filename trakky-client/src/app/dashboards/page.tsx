import { CustomTable } from '@/components/ui/table/table';
import { SubTitle } from '@/components/ui/text';
import {
  usePaymentData,
  useFilteredPayments,
  useYearSelection,
} from '@/lib/hooks/payments-hooks';
import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { FadeLeft, FadeUp } from '@/components/ui/animations/fade';
import Dashboards from '@/components/dashboards/dashboards';
import useDashboard from '@/lib/hooks/use-dashboard';
import Loading from '@/components/ui/loading';

function DashboardPage() {
  const { data: payments, refreshData, isLoading, isError } = usePaymentData();

  const {
    availableYears,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
  } = useYearSelection({
    payments,
    isLoading,
  });

  const { table } = usePaymentsTable({
    data: payments,
    selectedYear,
    refreshData,
    isLoading,
    selectedMonth,
  });

  const filteredPayments = useFilteredPayments(table);

  const { paymentOverviews, ownersOverview, expensesBreakdown } = useDashboard({
    data: filteredPayments,
    selectedYear,
  });

  return (
    <Loading loading={isLoading}>
      {!isError && (
        <div className="sticky top-20 z-30 md:px-0 mt-8">
          <YearSelection
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
      )}
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
    </Loading>
  );
}

export default DashboardPage;
