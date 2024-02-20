import { Title } from '@/components/ui/text';
import {
  usePaymentData,
  useFilteredPayments,
  useYearSelection,
} from '@/lib/hooks/payments-hooks';
import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { Containers } from '@/components/ui/containers';
import { FadeUp } from '@/components/ui/animations/fade';
import PaymentsTable from '@/components/payments/table';
import Dashboards from '@/components/dashboards/dashboards';
import Summary from '@/components/summary/summary';
import useDashboards from '@/lib/hooks/use-dashboard';
import useSummary from '@/lib/hooks/use-summary';
import Loading from '@/components/ui/loading';

function OverviewPage() {
  const { data: payments, refreshData, isLoading, isError } = usePaymentData();

  const { availableYears, selectedYear, setSelectedYear } = useYearSelection({
    payments,
    isLoading,
  });

  const { totalsPerYear, table, onDeleteConfirmed, onRefresh } =
    usePaymentsTable({
      data: payments,
      selectedYear,
      refreshData,
      isLoading,
    });

  const filteredPayments = useFilteredPayments(table);

  const { paymentOverviews, ownersOverview, expensesBreakdown } = useDashboards(
    { data: filteredPayments, selectedYear }
  );

  const { totalAmount, partialTotal, ownerBalances } = useSummary(
    table,
    selectedYear
  );

  return (
    <>
      <Title title="Overview" />
      <Loading loading={isLoading}>
        {!isError && (
          <YearSelection
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        )}
        <Containers>
          <Summary
            ownerBalances={ownerBalances}
            totalAmount={totalAmount}
            partialTotal={partialTotal}
            totalsPerYear={totalsPerYear}
            selectedYear={selectedYear ?? ''}
          />
        </Containers>
        <FadeUp>
          <div className="mt-6 text-center">
            <PaymentsTable
              table={table}
              onDeleteConfirmed={onDeleteConfirmed}
              onRefresh={onRefresh}
            />
          </div>
          <Dashboards
            paymentOverviews={paymentOverviews}
            ownersOverview={ownersOverview}
            expensesBreakdown={expensesBreakdown}
          />
        </FadeUp>
      </Loading>
    </>
  );
}

export default OverviewPage;
