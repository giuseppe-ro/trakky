import { useEffect } from 'react';
import { CustomTable } from '@/components/ui/table/table';
import { Title } from '@/components/ui/text';
import usePaymentData from '@/lib/hooks/page-hooks';
import YearSelection from '@/components/ui/data-selector';
import { useExpensesTable } from '@/lib/hooks/table-hooks';
import { Summary } from '@/components/ui/summary';
import { Containers } from '@/components/ui/containers';
import { PaymentForm } from '@/components/ui/table/payment-form';
import { TableActionMenu } from '@/components/ui/table/table-action-menu';
import { DeletePaymentsDialog } from '@/components/ui/table/delete-popup';
import { FadeUp } from '@/components/animations/fade';
import { StorageKey } from '@/constants';
import { Payment } from './models/dtos';

export default function App() {
  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const { totalsPerYear, table, onDeleteConfirmed, onRefresh } =
    useExpensesTable({
      data: payments,
      selectedYear,
      refreshData,
    });

  useEffect(() => {
    const activeColumns = localStorage.getItem(
      `expenses_${StorageKey.ActiveColumns}`
    );

    if (activeColumns) {
      try {
        table.setColumnVisibility(JSON.parse(activeColumns));
      } catch {
        localStorage.removeItem(`expenses_${StorageKey.ActiveColumns}`);
      }
    }
  }, [table]);

  return (
    <>
      <Title title="Expenses" />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <Containers>
        <Summary
          table={table}
          totalsPerYear={totalsPerYear}
          selectedYear={selectedYear ?? ''}
        />
      </Containers>
      <FadeUp>
        <div className="mt-4">
          <CustomTable
            table={table}
            canHideRows
            filtersOnly={false}
            page="home"
            tableActionMenu={
              <Containers className="transition">
                <TableActionMenu
                  exportName="Payments"
                  table={table}
                  onRefresh={onRefresh}
                  addForm={
                    <PaymentForm
                      refresh={() => onRefresh(false)}
                      title="Add New Transaction"
                    />
                  }
                  deleteForm={
                    <DeletePaymentsDialog
                      onDeleteConfirmed={onDeleteConfirmed}
                      entries={table
                        .getSelectedRowModel()
                        .rows.map((row) => row.original as Payment)}
                    />
                  }
                />
              </Containers>
            }
          />
        </div>
      </FadeUp>
    </>
  );
}
