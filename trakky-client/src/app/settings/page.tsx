import { CustomSmallTable, CustomTable } from "@/components/ui/table/table.tsx";
import { SubTitle, Text } from "@/components/ui/text.tsx";
import { useBudgetsData } from "@/lib/hooks/page-hooks.ts";
import { onTransactionsUpload, useBudgetsTable } from "@/lib/hooks/table-hooks.ts";
import { FadeLeft, FadeUp } from "@/components/animations/fade.tsx";
import { BudgetForm } from "@/components/ui/table/budget-form.tsx";
import { Containers } from "@/components/ui/containers.tsx";
import { TableActionMenu } from "@/components/ui/table/table-action-menu.tsx";
import { DeleteBudgetsDialog } from "@/components/ui/table/delete-popup.tsx";
import { Budget } from "@/infrastructure/budget.tsx";
import { useEffect, useReducer, useState } from "react";
import { AddTypes, DeleteTypes, getTypes, Type } from "@/infrastructure/transaction-type.tsx";
import { downloadFile } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { successFailToast, toast, valueExistsToast } from "@/components/ui/use-toast.ts";
import { AddOwners, DeleteOwners, getOwners, Owner } from "@/infrastructure/owner.tsx";
import { FileUploadItem } from "@/components/ui/table/file-upload.tsx";
import { fetchBackup } from "@/infrastructure/backup.tsx";
import { FetchActionType, FETCH_INITIAL_STATE, paymentFormDataReducer } from "@/components/ui/table/payment-form-reducer.ts";
import Spinner from "@/components/ui/spinner.tsx";


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
  const [newType, setNewType] = useState<string>("");
  const [newOwner, setNewOwner] = useState<string>("");
  const [fetchState, fetchDispatch] = useReducer(paymentFormDataReducer, FETCH_INITIAL_STATE);

  const fetchOwners = async (signal?: AbortSignal) => {
    if(fetchState.error) return;

    const { data: ownersData, error: ownersError } = await getOwners(signal);
    if(ownersError) {
      fetchDispatch({ type: FetchActionType.FETCH_ERROR, payload: ownersError });
      return;
    }

    fetchDispatch({ type: FetchActionType.FETCHED_OWNERS, payload: ownersData });
  }

  const fetchTypes = async (signal?: AbortSignal) => {
    if(fetchState.error) return;

    const { data: typesData, error: typesError } = await getTypes(signal);
    if(typesError) {
      fetchDispatch({ type: FetchActionType.FETCH_ERROR, payload: typesError });
      return;
    }

    fetchDispatch({ type: FetchActionType.FETCHED_TYPES, payload: typesData });
  }

  useEffect(  () => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchData() {
      fetchDispatch({ type: FetchActionType.FETCH_START });

      await fetchOwners(signal);
      await fetchTypes(signal);
    }

      fetchData().then(() => {
        fetchDispatch({ type: FetchActionType.FETCH_END });
      });
  }, []);

  async function OnTypeAdd() {
    if (newType.length === 0 || valueExistsToast(fetchState.types.map((o: Type) => o.name), newType)) return;
    const success = await AddTypes([{ name: newType } as Type]);
    await fetchTypes();
    successFailToast({ success: success, successMessage: "Type added", errorMessage: "Couldn't save Type!" });
  }

  async function OnTypeDeleteConfirmed(id: number) {
    const success = await DeleteTypes([id]);
    await fetchTypes();
    successFailToast({ success: success, successMessage: "Type Removed", errorMessage: "Couldn't remove Type!" });
  }

  async function OnOwnerAdd() {
    if (newOwner.length === 0 || valueExistsToast(fetchState.owners.map((o: Owner) => o.name), newOwner)) return;
    const success = await AddOwners([{ name: newOwner } as Owner]);
    await fetchOwners();
    successFailToast({ success: success, successMessage: "Owner added", errorMessage: "Couldn't save Owner!" });
  }

  async function OnOwnerDeleteConfirmed(id: number) {
    const success = await DeleteOwners([id]);
    await fetchOwners();
    successFailToast({ success: success, successMessage: "Owner Removed", errorMessage: "Couldn't remove Owner!" });
  }

  async function DownloadBackup() {
    try {
      const backup = await fetchBackup();

      downloadFile(JSON.stringify(backup), "json", "Backup");

    } catch (e) {
      toast({
        title: "Error",
        description: "Couldn't download backup!",
        duration: 2000,
        variant: "destructive"
      })
    }
  }

  return (
    <>
      <Text title={"Settings"} />
      <FadeLeft>
        <div className="flex flex-col mb-4 md:mb-0">
          <SubTitle title={"Backup"} {...{ className: "text-center mt-4" }} />
          <div className="flex flex-row gap-2">
            <Button variant="outline" className="w-full" onClick={DownloadBackup}>Download Backup</Button>
            <Button variant="outline" className="w-full" disabled>Upload Backup</Button>
          </div>
        </div>
        <div className="flex flex-col mb-4 md:mb-0">
          <SubTitle title={"Transactions"} {...{ className: "text-center mt-4" }} />
          <FileUploadItem
            onUpload={onTransactionsUpload}
            text={"Upload Transactions"}
            className={""} />
        </div>
      </FadeLeft>
      {fetchState.error ? <Text title={fetchState.error.message} />
        : fetchState.loading ? <Spinner className="flex justify-center align-middle my-12" />
          :
          <FadeUp>
            <div className="flex flex-col lg:flex-row gap-3 justify-center">
              <div className="flex-grow">
                <SubTitle title={"Budgets"} {...{ className: "text-center mt-4" }} />
                <CustomTable
                  table={table}
                  canHideRows={true}
                  filtersOnly={false}
                  page="settings"
                  tableActionMenu={
                    <Containers className="transition">
                      <TableActionMenu
                        exportName={"Budgets"}
                        table={table}
                        onRefresh={onRefresh}
                        addForm={<BudgetForm
                          refresh={() => onRefresh(false)}
                          existingDates={budgets.map((b) => new Date(b.date))}
                          title={"Add New Budget"}
                        ></BudgetForm>}
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
                    </Containers>
                  }
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center flex-grow">
                <CustomSmallTable
                  title={"Types"}
                  values={fetchState.types}
                  onAdd={OnTypeAdd}
                  newValue={newType}
                  setNew={setNewType}
                  onDeleteConfirmed={OnTypeDeleteConfirmed}
                />
                <CustomSmallTable
                  title={"Owners"}
                  values={fetchState.owners}
                  onAdd={OnOwnerAdd}
                  newValue={newOwner}
                  setNew={setNewOwner}
                  onDeleteConfirmed={OnOwnerDeleteConfirmed}
                />
              </div>
            </div>

          </FadeUp>
      }
    </>
  );
}

export default SettingsPage;
