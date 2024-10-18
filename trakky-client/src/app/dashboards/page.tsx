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
import useDashboard from '@/lib/hooks/use-dashboard';
import Loading from '@/components/ui/loading';
import { PageContainer } from '@/components/ui/containers';
import Dashboards from './components/dashboards';

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
      <PageContainer>
        <FadeLeft>
          <div className="mt-6 text-center" aria-label="Filters">
            <SubTitle title="Filters" />
            {!isError && (
              <div className="my-1">
                <YearSelection
                  availableYears={availableYears}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  selectedMonth={selectedMonth}
                  onMonthChange={setSelectedMonth}
                />
              </div>
            )}
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
      </PageContainer>
    </Loading>
  );
}

export default DashboardPage;
