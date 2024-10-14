import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { Containers } from '@/components/ui/containers';
import { FadeUp } from '@/components/ui/animations/fade';
import useSummary from '@/lib/hooks/use-summary';
import Loading from '@/components/ui/loading';
import { usePaymentData, useYearSelection } from '@/lib/hooks/payments-hooks';
import CalculatedShareAccordion from '@/components/summary/calculated-share';
import { SubTitle } from '@/components/ui/text';
import { CustomTable } from '@/components/ui/table/table';

export default function SharePage() {
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

  const { table, onRefresh } = usePaymentsTable({
    data: payments ?? [],
    selectedYear,
    selectedMonth,
    refreshData,
    isLoading,
  });

  const { balances } = useSummary(table, selectedYear);

  return (
    <Loading loading={isLoading}>
      <div className="mt-12 text-center" aria-label="Filters">
        <SubTitle title="Filters" />
        {!isError && (
          <div className="my-1">
            <YearSelection
              availableYears={availableYears}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onMonthChange={setSelectedMonth}
              selectedMonth={selectedMonth}
            />
          </div>
        )}
        <CustomTable table={table} filtersOnly page="dashboard" />
      </div>
      <div />
      <FadeUp>
        <Containers className="mt-12">
          {balances && (
            <CalculatedShareAccordion
              balances={balances}
              onRefresh={onRefresh}
            />
          )}
        </Containers>
      </FadeUp>
    </Loading>
  );
}
