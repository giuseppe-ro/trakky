import { CustomTable } from "@/components/ui/table/table.tsx";
import { SubTitle, Text } from "@/components/ui/text.tsx";
import { useBudgetsData } from "@/lib/hooks/page-hooks.ts";
import { useBudgetsTable } from "@/lib/hooks/table-hooks.ts";
import { FadeLeft } from "@/components/animations/fade.tsx";
import { BudgetForm } from "@/components/ui/table/budget-form.tsx";
import { Containers } from "@/components/ui/containers.tsx";
import { TableActionMenu } from "@/components/ui/table/table-action-menu.tsx";
import { DeleteBudgetsDialog, DeleteDialog } from "@/components/ui/table/delete-popup.tsx";
import { Budget } from "@/infrastructure/budget.tsx";
import { useEffect, useState } from "react";
import { AddTypes, DeleteTypes, fetchTypes, Type } from "@/infrastructure/transaction-type.tsx";
import { TableRow } from "@/components/ui/table.tsx";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { SubmittableInput } from "@/components/ui/input.tsx";
import { successFailToast, valueExistsToast } from "@/components/ui/use-toast.ts";
import { AddOwners, DeleteOwners, fetchOwners, Owner } from "@/infrastructure/owner.tsx";


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

  const [types, setTypes] = useState<Type[]>([]);
  const [newType, setNewType] = useState<string>("");
  const [newOwner, setNewOwner] = useState<string>("");

  const [owners, setOwners] = useState<Owner[]>([]);

  useEffect(() => {
    fetchTypes().then((types) => setTypes(types));
    fetchOwners().then((owners) => setOwners(owners));
  }, []);

  async function OnTypeAdd() {
    if(newType.length === 0 || valueExistsToast(types.map((o) => o.name), newType)) return;

    const success = await AddTypes([{ name: newType } as Type]);

    successFailToast({ success: success, successMessage: "Type added", errorMessage: "Something went wrong, couldn't save Type!" });

    setTypes(await fetchTypes())
  }

  async function OnTypeDeleteConfirmed(id: number) {
    const success = await DeleteTypes([id]);

    successFailToast({ success: success, successMessage: "Type Removed", errorMessage: "Something went wrong, couldn't remove Type!" });
    setTypes(await fetchTypes())
  }

  async function OnOwnerAdd() {
    if(newOwner.length === 0 || valueExistsToast(owners.map((o) => o.name), newOwner)) return;

    const success = await AddOwners([{ name: newOwner } as Owner]);

    successFailToast({ success: success, successMessage: "Owner added", errorMessage: "Something went wrong, couldn't save Owner!" });

    setTypes(await fetchOwners())
  }

  async function OnOwnerDeleteConfirmed(id: number) {
    const success = await DeleteOwners([id]);

    successFailToast({ success: success, successMessage: "Owner Removed", errorMessage: "Something went wrong, couldn't remove Owner!" });
    setTypes(await fetchOwners())
  }

  return (
    <>
      <Text title={"Settings"} />
      <FadeLeft>
        <div className="flex flex-col lg:flex-row justify-around">
          <>
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
                           />
                       }
                     />
                 </Containers>,
             }}
             {...{ className: "lg:col-span-1" }}
           />
          </>
          <div>
            <SubTitle title={"Types"} {...{ className: "text-center mt-4" }}   />
              <div className="flex my-2 flex-row lg:flex-row justify-around">
                <Button
                  disabled={newType.length === 0}
                  onClick={() => OnTypeAdd()}
                  type={"submit"}
                  variant="outline"
                  className="rounded-r-none border-green-500/50 hover:bg-green-500/50"
                >
                  Add
                </Button>
                <SubmittableInput
                  onSubmit={() => OnTypeAdd()}
                  onChange={(e) => setNewType(e.target.value)}
                  className="rounded-l-none focus-visible:ring-0 h-8 outline-none"
                />

              </div>
              <table>
                <tbody>
                {types && types.map((type: Type) => (
                  <TableRow key={type.id} className="w-full justify-center align-middle">
                    <td className={cn(`text-left border-r-0 py-0.5 px-2 font-thin text-xs w-full border overflow-x-scroll scroll-smooth`)}>
                      {type.name}
                    </td>
                    <td className="m-6 text-left border px-0 overflow-x-scroll scroll-smooth">
                      <DeleteDialog
                        onDeleteConfirmed={() => OnTypeDeleteConfirmed(type.id)}
                        entries={type.name}
                        tooltipText={"Delete"}
                      />
                    </td>
                  </TableRow>
                ))}
                </tbody>
              </table>
          </div>
          <div>
            <SubTitle title={"Owners"} {...{ className: "text-center mt-4" }}   />
            <div className="flex my-2 flex-row lg:flex-row justify-around">
              <Button
                disabled={newOwner.length === 0}
                onClick={() => OnOwnerAdd()}
                type={"submit"}
                variant="outline"
                className="rounded-r-none border-green-500/50 hover:bg-green-500/50"
              >
                Add
              </Button>
              <SubmittableInput
                onSubmit={() => OnOwnerAdd()}
                onChange={(e) => setNewOwner(e.target.value)}
                className="rounded-l-none focus-visible:ring-0 h-8 outline-none"
              />

            </div>
            <table>
              <tbody>
              {owners && owners.map((owner: Owner) => (
                <TableRow key={owner.id} className="w-full justify-center align-middle">
                  <td className={cn(`text-left border-r-0 py-0.5 px-2 font-thin text-xs w-full border overflow-x-scroll scroll-smooth`)}>
                    {owner.name}
                  </td>
                  <td className="m-6 text-left border px-0 overflow-x-scroll scroll-smooth">
                    <DeleteDialog
                      onDeleteConfirmed={() => OnOwnerDeleteConfirmed(owner.id)}
                      entries={owner.name}
                      tooltipText={"Delete"}
                    />
                  </td>
                </TableRow>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeLeft>
    </>
  );
}

export default SettingsPage;
