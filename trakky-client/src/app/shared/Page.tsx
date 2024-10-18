import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { FadeUp } from '@/components/ui/animations/fade';
import useSummary from '@/lib/hooks/use-summary';
import Loading from '@/components/ui/loading';
import { usePaymentData, useYearSelection } from '@/lib/hooks/payments-hooks';
import CalculatedShareAccordion from '@/components/summary/calculated-share';
import { SubTitle } from '@/components/ui/text';
import { monthNameToNumber } from '@/lib/text-formatter';
import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/ui/containers';
import { Owner } from '@/models/dtos';
import { Client } from '@/infrastructure/client-injector';
import { Endpoint } from '@/constants';
import { Dictionary } from '@/components/ui/table/icons';
import { ColumnFilter } from '@tanstack/react-table';
import { SingleButtonFilter, MultyButtonFilters } from './components/filters';

export default function SharePage() {
  const [date, setDate] = useState<Date | null>(null);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Dictionary<boolean>>({});
  const [selectedCategories, setSelectedCategories] = useState<
    Dictionary<boolean>
  >({});
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
    const controller = new AbortController();
    const { signal } = controller;

    Client.Get(Endpoint.Owners, signal).then(({ data, error }) => {
      if (data && !error) {
        setOwners(data as Owner[]);
      }
    });
  }, []);

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

  useEffect(() => {
    const filters: ColumnFilter[] = [];

    Object.keys(selectedCategories).forEach((category) => {
      if (category !== 'All' && selectedCategories[category]) {
        filters.push({ id: 'type', value: category });
      }
    });

    table.setColumnFilters(filters);
  }, [selectedCategories, table]);

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
          <div>
            <MultyButtonFilters
              title="Share Amongst:"
              checkBoxStates={selectedUsers}
              setCheckboxStates={setSelectedUsers}
              entries={owners.map((owner) => owner.name)}
            />
          </div>
          <div>
            <SingleButtonFilter
              title="Filter Categories:"
              checkBoxStates={selectedCategories}
              setCheckboxStates={setSelectedCategories}
              entries={Array.from(
                table.getColumn('type')?.getFacetedUniqueValues().keys() || []
              )}
            />
          </div>
        </div>
        <div />
        <FadeUp>
          {balances && (
            <CalculatedShareAccordion
              checkBoxStates={selectedUsers}
              setCheckboxStates={setSelectedUsers}
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
