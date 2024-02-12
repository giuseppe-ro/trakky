import { CustomTable } from "@/components/ui/table/table.tsx";
import { SubTitle, Title } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks/page-hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";
import { useExpensesTable } from "@/lib/hooks/table-hooks.ts";
import { Summary } from "@/components/ui/summary.tsx";
import { Payment } from "@/infrastructure/payment.tsx";
import { useEffect, useState } from "react";
import { ExpensesPieChart, UsersDashboard, ExpensesDashboard } from "@/app/dashboards/components/dashboards.tsx";
import { useDashboards } from "@/lib/hooks/dashboards-hooks.ts";
import { Containers } from "@/components/ui/containers.tsx";
import { PaymentForm } from "@/components/ui/table/payment-form.tsx";
import { TableActionMenu } from "@/components/ui/table/table-action-menu.tsx";
import { DeletePaymentsDialog } from "@/components/ui/table/delete-popup.tsx";
import { FadeUp } from "@/components/animations/fade.tsx";

function OverviewPage() {
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  const {
    payments,
    availableYears,
    selectedYear,
    refreshData,
    setSelectedYear,
  } = usePaymentData();

  const {
    totalsPerYear,
    table,
    onDeleteConfirmed,
    onRefresh,
  } = useExpensesTable({
    data: payments,
    selectedYear,
    refreshData,
  })

  useEffect(() => {
    const filteredPayments = table
      .getFilteredRowModel()
      .rows
      .map((row) => (
        {
          id: row.getValue("date"),
          amount: row.getValue("amount"),
          type: row.getValue("type"),
          owner: row.getValue("owner"),
          description: row.getValue("description"),
          date: row.getValue("date")
        }) as Payment);

    setFilteredPayments(filteredPayments);

  }, [table.getFilteredRowModel()]);

  const {
    paymentOverviews,
    ownersOverview,
    expensesBreakdown
  } = useDashboards({ data: filteredPayments, selectedYear });

  return (
    <>
      <Title title={"Overview"} />
      <YearSelection
        availableYears={availableYears}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <Containers>
        <Summary
          table={table}
          totalsPerYear={totalsPerYear}
          selectedYear={selectedYear ?? ""}
        />
      </Containers>
      <FadeUp>
        <div className="mt-6 text-center">
          <CustomTable
            table={table}
            canHideRows={true}
            filtersOnly={false}
            page="overview"
            tableActionMenu={
              <Containers className="transition">
                <TableActionMenu
                  exportName={"Payments"}
                  table={table}
                  onRefresh={onRefresh}
                  addForm={
                    <PaymentForm
                      refresh={() => onRefresh(false)}
                      title={"Add New Transaction"}
                    ></PaymentForm>
                  }
                  deleteForm={
                    <DeletePaymentsDialog
                      tooltipText={"Delete selected rows"}
                      onDeleteConfirmed={onDeleteConfirmed}
                      entries={table
                        .getSelectedRowModel()
                        .rows.map((row: any) => row.original as Payment)}
                    ></DeletePaymentsDialog>
                  }
                />
              </Containers>
            }
          />
        </div>
        <div className="mt-6 text-center mr-4 lg:mx-0">
          <div className="lg:grid gap-4 lg:grid-cols-2">
            <div className="mt-4 sm:mt-0">
              <SubTitle title={"Expenses"} />
              <ExpensesDashboard data={paymentOverviews} />
            </div>
            <div className="mt-4 sm:mt-0">
              <SubTitle title={"Users Comparison"} { ...{ className: "mb-4" }} />
              <UsersDashboard data={ownersOverview} />
            </div>
          </div>
        </div>
        <div className="mt-6 text-center mr-4 lg:mx-0">
          <div className="lg:grid gap-4 lg:grid-cols-1">
            <div className="mt-6 lg:mt-0">
              <SubTitle title={"Breakdown"} />
              <ExpensesPieChart data={expensesBreakdown}></ExpensesPieChart>
            </div>
          </div>
        </div>
      </FadeUp>
    </>
  );
}

export default OverviewPage;
