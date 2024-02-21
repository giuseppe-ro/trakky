import { Title } from '@/components/ui/text';
import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { Containers } from '@/components/ui/containers';
import { FadeUp } from '@/components/ui/animations/fade';
import useSummary from '@/lib/hooks/use-summary';
import Loading from '@/components/ui/loading';
import { usePaymentData, useYearSelection } from '@/lib/hooks/payments-hooks';
import Summary from '@/components/summary/summary';
import PaymentsTable from '@/components/payments/table';

export default function App() {
  const { data: payments, refreshData, isLoading, isError } = usePaymentData();

  const { availableYears, selectedYear, setSelectedYear } = useYearSelection({
    payments,
    isLoading,
  });

  const { totalsPerYear, table, onDeleteConfirmed, onRefresh } =
    usePaymentsTable({
      data: payments ?? [],
      selectedYear,
      refreshData,
      isLoading,
    });

  const { totalAmount, partialTotal, ownerBalances } = useSummary(
    table,
    selectedYear
  );

  return (
    <>
      <Title title="Expenses" />
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
          <div className="mt-4">
            <PaymentsTable
              table={table}
              onDeleteConfirmed={onDeleteConfirmed}
              onRefresh={onRefresh}
            />
          </div>
        </FadeUp>
      </Loading>
    </>
  );
}
