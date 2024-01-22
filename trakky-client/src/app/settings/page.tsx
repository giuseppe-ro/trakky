import { CustomTable } from "@/components/ui/table/table.tsx";
import { SubTitle, Text } from "@/components/ui/text.tsx";
import { useBudgetsData } from "@/lib/hooks/page-hooks.ts";
import { useBudgetsTable } from "@/lib/hooks/table-hooks.ts";
import { FadeLeft } from "@/components/animations/fade.tsx";
import { BudgetForm } from "@/components/ui/table/budget-form.tsx";
import { Containers } from "@/components/ui/containers.tsx";
import { TableActionMenu } from "@/components/ui/table/table-action-menu.tsx";
import { DeleteBudgetsDialog } from "@/components/ui/table/delete-popup.tsx";
import { Budget } from "@/infrastructure/budget.tsx";


function SettingsPage() {
  const {
    budgets,
    refreshData,
  } = useBudgetsData();

  const {
    table,
    onDeleteConfirmed,
    onRefresh,
  } = useBudgetsTable({
    data: budgets,
    refreshData,
  })

  return (
    <>
      <Text title={"Settings"} />
      <FadeLeft>
        <div className="flex flex-col lg:flex-row justify-around">
          <div>
           <SubTitle title={"Budgets"} {...{ className: "text-center" }}   />
           <CustomTable
             tableProps={{
               table,
               filtersOnly: false,
               page: "settings",
               tableActionMenu:
                  <Containers className="transition">
                    <TableActionMenu
                       table={table}
                       onRefresh={onRefresh}
                       addForm={ <BudgetForm
                         refresh={() => onRefresh(false)}
                         existingDates={budgets.map((b) => new Date(b.date))}
                         title={"Add New Budget"}
                       ></BudgetForm> }
                       deleteForm={
                         <DeleteBudgetsDialog
                           tooltipText={"Delete selected rows"}
                           onDeleteConfirmed={onDeleteConfirmed}
                           entries={table
                             .getSelectedRowModel()
                             .rows.map((row: any) => row.original as Budget)}
                         ></DeleteBudgetsDialog>
                       }
                     />
                 </Containers>,
             }}
             {...{ className: "lg:col-span-1" }}
           />
         </div>
        </div>
      </FadeLeft>
    </>
  );
}

export default SettingsPage;
