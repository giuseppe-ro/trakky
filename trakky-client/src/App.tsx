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
import CalculatedShareAccordion from './components/summary/calculated-share';

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

  const { totalAmount, partialTotal, balances } = useSummary(
    table,
    selectedYear
  );

  return (
    <>
      <Title title="Home" />
      <Loading loading={isLoading}>
        <Containers>
          <Summary
            balances={balances}
            totalAmount={totalAmount}
            partialTotal={partialTotal}
            totalsPerYear={totalsPerYear}
            selectedYear={selectedYear ?? ''}
            selectedMonth={selectedMonth ?? ''}
          />
        </Containers>
        <Containers className="pt-5">
          {balances && <CalculatedShareAccordion balances={balances} />}
        </Containers>
        <div />
        <FadeUp>
          {!isError && (
            <YearSelection
              availableYears={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
              selectedMonth={selectedMonth}
            />
          )}
          <PaymentsTable
            table={table}
            onDeleteConfirmed={onDeleteConfirmed}
            onRefresh={onRefresh}
          />
        </FadeUp>
      </Loading>
    </>
  );
}
