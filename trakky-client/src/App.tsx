import { CustomTable } from "@/components/ui/table/table";
import { Text } from "@/components/ui/text.tsx";
import { usePaymentData } from "@/lib/hooks/page-hooks.ts";
import { YearSelection } from "@/components/ui/data-selector.tsx";
import { useExpensesTable } from "@/lib/hooks/table-hooks.ts";
import { Summary } from "@/components/ui/summary.tsx";
import { useEffect } from "react";
import { Containers } from "@/components/ui/containers.tsx";
import { PaymentForm } from "@/components/ui/table/payment-form.tsx";
import { TableActionMenu } from "@/components/ui/table/table-action-menu.tsx";
import { DeletePaymentsDialog } from "@/components/ui/table/delete-popup.tsx";
import { Payment } from "@/infrastructure/payment.tsx";


export default function App() {
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
    const activeColumns = localStorage.getItem("expenses_active_columns");

    if(activeColumns) {
      try {
        table.setColumnVisibility(JSON.parse(activeColumns));
      } catch (e) {
        localStorage.removeItem("expenses_active_columns")
        console.log(e);
      }
    }
  }, []);

  return (
    <>
      <Text title={"Expenses"} />
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
      <div className="mt-4">
        <CustomTable
          tableProps={{
            table,
            filtersOnly: false,
            page: "overview",
            tableActionMenu:
              <Containers className="transition">
                <TableActionMenu
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
              </Containers>,
          }}
        />
      </div>
    </>
  );
}
