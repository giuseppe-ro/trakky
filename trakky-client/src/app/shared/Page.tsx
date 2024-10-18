import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { FadeUp } from '@/components/ui/animations/fade';
import useSummary from '@/lib/hooks/use-summary';
import Loading from '@/components/ui/loading';
import { usePaymentData, useYearSelection } from '@/lib/hooks/payments-hooks';
import CalculatedShareAccordion from '@/components/summary/calculated-share';
import { SubTitle } from '@/components/ui/text';
import { CustomTable } from '@/components/ui/table/table';
import { monthNameToNumber } from '@/lib/text-formatter';
import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/ui/containers';

export default function SharePage() {
  const [date, setDate] = useState<Date | null>(null);
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

  useEffect(() => {
    if (selectedYear === 'All Years' || selectedMonth === 'All Months') {
      setDate(null);
    } else {
      setDate(
        new Date(
          `${selectedYear}/${monthNameToNumber(selectedMonth ?? 'January')}/01`
        )
      );
    }
  }, [selectedMonth, selectedYear]);

  return (
    <Loading loading={isLoading}>
      <PageContainer>
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
          {balances && (
            <CalculatedShareAccordion
              balances={balances}
              onRefresh={onRefresh}
              date={date}
              showPayDebitButton={
                selectedMonth !== null && selectedMonth !== 'All Months'
              }
            />
          )}
        </FadeUp>
      </PageContainer>
    </Loading>
  );
}
