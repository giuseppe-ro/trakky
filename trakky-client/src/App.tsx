import { Title } from '@/components/ui/text';
import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { Containers } from '@/components/ui/containers';
import { FadeUp } from '@/components/ui/animations/fade';
import { usePaymentData } from '@/lib/hooks/payments-hooks';
import useSummary from '@/lib/hooks/use-summary';
import Loading from '@/components/ui/loading';
import PaymentsTable from './components/payments/table';
import Summary from './components/summary/summary';

export default function App() {
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

  const { totalAmount, partialTotal, ownerBalances } = useSummary(
    table,
    selectedYear
  );

  return (
    <>
      <Title title="Expenses" />
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
