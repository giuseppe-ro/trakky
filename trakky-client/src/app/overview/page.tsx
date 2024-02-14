import { useEffect, useState } from 'react';

import { CustomTable } from '@/components/ui/table/table';
import { SubTitle, Title } from '@/components/ui/text';
import usePaymentData from '@/lib/hooks/page-hooks';
import YearSelection from '@/components/ui/data-selector';
import { useExpensesTable } from '@/lib/hooks/table-hooks';
import { Summary } from '@/components/ui/summary';
import {
  ExpensesPieChart,
  UsersDashboard,
  ExpensesDashboard,
} from '@/app/dashboards/components/dashboards';
import { useDashboards } from '@/lib/hooks/dashboards-hooks';
import { Containers } from '@/components/ui/containers';
import { PaymentForm } from '@/components/ui/table/payment-form';
import { TableActionMenu } from '@/components/ui/table/table-action-menu';
import { DeletePaymentsDialog } from '@/components/ui/table/delete-popup';
import { FadeUp } from '@/components/animations/fade';
import { Payment } from '@/models/dtos';

function OverviewPage() {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

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

  const filteredRowModel = table.getFilteredRowModel();

  useEffect(() => {
    const newFilteredPayments = filteredRowModel.rows.map(
      (row) =>
        ({
          id: row.getValue('date'),
          amount: row.getValue('amount'),
          type: row.getValue('type'),
          owner: row.getValue('owner'),
          description: row.getValue('description'),
          date: row.getValue('date'),
        }) as Payment
    );

    setFilteredPayments(newFilteredPayments);
  }, [filteredRowModel]);

  const { paymentOverviews, ownersOverview, expensesBreakdown } = useDashboards(
    { data: filteredPayments, selectedYear }
  );

  return (
    <>
      <Title title="Overview" />
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
        <div className="mt-6 text-center">
          <CustomTable
            table={table}
            canHideRows
            filtersOnly={false}
            page="overview"
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
        <div className="mt-6 text-center mr-4 lg:mx-0">
          <div className="lg:grid gap-4 lg:grid-cols-2">
            <div className="mt-4 sm:mt-0">
              <SubTitle title="Expenses" />
              <ExpensesDashboard data={paymentOverviews} />
            </div>
            <div className="mt-4 sm:mt-0">
              <SubTitle title="Users Comparison" {...{ className: 'mb-4' }} />
              <UsersDashboard data={ownersOverview} />
            </div>
          </div>
        </div>
        <div className="mt-6 text-center mr-4 lg:mx-0">
          <div className="lg:grid gap-4 lg:grid-cols-1">
            <div className="mt-6 lg:mt-0">
              <SubTitle title="Breakdown" />
              <ExpensesPieChart data={expensesBreakdown} />
            </div>
          </div>
        </div>
      </FadeUp>
    </>
  );
}

export default OverviewPage;
