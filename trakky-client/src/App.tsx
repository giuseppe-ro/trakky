import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { FadeUp } from '@/components/ui/animations/fade';
import useSummary from '@/lib/hooks/use-summary';
import Loading from '@/components/ui/loading';
import { usePaymentData, useYearSelection } from '@/lib/hooks/payments-hooks';
import Summary from '@/components/summary/summary';
import PaymentsTable from '@/components/payments/table';
import { twMerge } from 'tailwind-merge';
import { demoMode } from './constants';
import { PageContainer } from './components/ui/containers';

export default function App() {
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

  const { totalsPerYear, table, onDeleteConfirmed, onRefresh } =
    usePaymentsTable({
      data: payments ?? [],
      selectedYear,
      selectedMonth,
      refreshData,
      isLoading,
    });

  const { totalAmount, partialTotal } = useSummary(table, selectedYear);

  return (
    <Loading loading={isLoading}>
      <PageContainer>
        <Summary
          totalAmount={totalAmount}
          partialTotal={partialTotal}
          totalsPerYear={totalsPerYear}
          selectedYear={selectedYear ?? ''}
          selectedMonth={selectedMonth ?? ''}
          {...{ className: twMerge(demoMode ? 'mt-4' : 'mt-2') }}
        />
        {!isError && (
          <YearSelection
            availableYears={availableYears}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            selectedMonth={selectedMonth}
          />
        )}
        <div />
        <FadeUp>
          <PaymentsTable
            table={table}
            onDeleteConfirmed={onDeleteConfirmed}
            onRefresh={onRefresh}
          />
        </FadeUp>
      </PageContainer>
    </Loading>
  );
}
