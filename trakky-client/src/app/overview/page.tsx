import { Title } from '@/components/ui/text';
import {
  usePaymentData,
  useFilteredPayments,
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
  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const { totalsPerYear, table, onDeleteConfirmed, onRefresh } =
    usePaymentsTable({
      data: payments,
      selectedYear,
      refreshData,
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
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <Loading loading={payments.length === 0}>
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
