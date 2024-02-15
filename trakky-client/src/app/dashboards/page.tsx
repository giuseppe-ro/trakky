import { useEffect, useState } from 'react';

import { CustomTable } from '@/components/ui/table/table';
import { SubTitle, Title } from '@/components/ui/text';
import usePaymentData from '@/lib/hooks/payments-hooks';
import YearSelection from '@/components/ui/data-selector';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import { FadeLeft, FadeUp } from '@/components/ui/animations/fade';
import { Payment } from '@/models/dtos';
import Dashboards from '@/components/dashboards/dashboards';
import useDashboard from '@/lib/hooks/use-dashboard';

function DashboardPage() {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const { table } = usePaymentsTable({
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

  const { paymentOverviews, ownersOverview, expensesBreakdown } = useDashboard({
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
        <Dashboards
          paymentOverviews={paymentOverviews}
          ownersOverview={ownersOverview}
          expensesBreakdown={expensesBreakdown}
        />
      </FadeUp>
    </>
  );
}

export default DashboardPage;
