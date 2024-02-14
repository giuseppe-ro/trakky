import { useEffect, useState } from 'react';

import { CustomTable } from '@/components/ui/table/table';
import { SubTitle, Title } from '@/components/ui/text';
import usePaymentData from '@/lib/hooks/page-hooks';
import YearSelection from '@/components/ui/data-selector';
import { useExpensesTable } from '@/lib/hooks/table-hooks';
import {
  ExpensesPieChart,
  UsersDashboard,
  ExpensesDashboard,
} from '@/app/dashboards/components/dashboards';
import dashboards from '@/lib/hooks/dashboards-hooks';
import { FadeLeft, FadeUp } from '@/components/animations/fade';
import { Payment } from '@/models/dtos';

function DashboardPage() {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const { table } = useExpensesTable({
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

  const { paymentOverviews, ownersOverview, expensesBreakdown } = dashboards({
    data: filteredPayments,
    selectedYear,
  });

  return (
    <>
      <Title title="Dashboards" />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <FadeLeft>
        <div className="mt-6 text-center">
          <SubTitle title="Filters" />
          <CustomTable table={table} filtersOnly page="dashboard" />
        </div>
      </FadeLeft>
      <FadeUp>
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
          <div>
            <SubTitle title="Breakdown" />
            <ExpensesPieChart data={expensesBreakdown} />
          </div>
        </div>
      </FadeUp>
    </>
  );
}

export default DashboardPage;
