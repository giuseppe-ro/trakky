import { useEffect, useReducer, useState } from 'react';
import { CustomSmallTable, CustomTable } from '@/components/ui/table/table';
import { SubTitle, Title } from '@/components/ui/text';
import { onTransactionsUpload, useBudgetsTable } from '@/lib/hooks/table-hooks';
import { FadeLeft, FadeUp } from '@/components/ui/animations/fade';
import { downloadFile } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  successFailToast,
  toast,
  valueExistsToast,
} from '@/components/ui/use-toast';
import { AddOwners, DeleteOwners, GetOwners } from '@/infrastructure/owner';
import { FileUploadItem } from '@/components/ui/table/file-upload';
import GetBackup from '@/infrastructure/backup';
import {
  FetchActionType,
  FETCH_INITIAL_STATE,
  paymentFormDataReducer,
} from '@/components/ui/table/payment-form-reducer';
import { Type, Owner, Budget } from '@/models/dtos';
import { GetBudgets } from '@/infrastructure/budget';
import { ContentResultContainer } from '@/components/ui/containers';
import { ErrorMessage } from '@/infrastructure/base-api';
import { GetTypes, AddTypes, DeleteTypes } from '@/infrastructure/types';
import Loading from '@/components/ui/loading';
import BudgetActionMenu from './components/budget-action-menu';

function SettingsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  async function refreshData(
    flushBeforeRefresh: boolean = true,
    signal?: AbortSignal
  ) {
    if (flushBeforeRefresh) setBudgets([]);

    const { data, error } = await GetBudgets(signal);

    if (error) throw new Error(error.error);

    setBudgets(data);
  }

  const { table, onDeleteConfirmed, onRefresh } = useBudgetsTable({
    data: budgets,
    refreshData,
  });
  const [newType, setNewType] = useState<string>('');
  const [newOwner, setNewOwner] = useState<string>('');
  const [fetchState, fetchDispatch] = useReducer(
    paymentFormDataReducer,
    FETCH_INITIAL_STATE
  );

  const fetchOwners = async (signal?: AbortSignal) => {
    if (fetchState.error) return;

    const { data: ownersData, error: ownersError } = await GetOwners(signal);
    if (ownersError) {
      fetchDispatch({
        type: FetchActionType.FETCH_ERROR,
        payload: ownersError,
      });
      return;
    }

    fetchDispatch({
      type: FetchActionType.FETCHED_OWNERS,
      payload: ownersData,
    });
  };

  const fetchTypes = async (signal?: AbortSignal) => {
    if (fetchState.error) return;

    const { data: typesData, error: typesError } = await GetTypes(signal);
    if (typesError) {
      fetchDispatch({ type: FetchActionType.FETCH_ERROR, payload: typesError });
      return;
    }

    fetchDispatch({ type: FetchActionType.FETCHED_TYPES, payload: typesData });
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchData() {
      fetchDispatch({ type: FetchActionType.FETCH_START });

      await fetchOwners(signal);
      await fetchTypes(signal);
      await refreshData(true, signal);
    }

    fetchData()
      .then(() => {
        fetchDispatch({ type: FetchActionType.FETCH_END });
      })
      .catch((e) => {
        fetchDispatch({
          type: FetchActionType.FETCH_ERROR,
          payload: e.message ?? ErrorMessage.UNKNOWN_ERROR,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const OnTypeAdd = async () => {
    if (
      newType.length === 0 ||
      valueExistsToast(
        fetchState.types.map((o: Type) => o.name),
        newType
      )
    )
      return;
    const success = await AddTypes([{ name: newType } as Type]);
    await fetchTypes();
    successFailToast({
      success,
      successMessage: 'Type added',
      errorMessage: "Couldn't save Type!",
    });
  };

  async function OnTypeDeleteConfirmed(id: number) {
    const success = await DeleteTypes([id]);
    await fetchTypes();
    successFailToast({
      success,
      successMessage: 'Type Removed',
      errorMessage: "Couldn't remove Type!",
    });
  }

  const OnOwnerAdd = async () => {
    if (
      newOwner.length === 0 ||
      valueExistsToast(
        fetchState.owners.map((o: Owner) => o.name),
        newOwner
      )
    )
      return;
    const success = await AddOwners([{ name: newOwner } as Owner]);
    await fetchOwners();
    successFailToast({
      success,
      successMessage: 'Owner added',
      errorMessage: "Couldn't save Owner!",
    });
  };

  const OnOwnerDeleteConfirmed = async (id: number) => {
    const success = await DeleteOwners([id]);
    await fetchOwners();
    successFailToast({
      success,
      successMessage: 'Owner Removed',
      errorMessage: "Couldn't remove Owner!",
    });
  };

  const errorToast = (message: string) => {
    toast({
      title: 'Error',
      description: message,
      duration: 2000,
      variant: 'destructive',
    });
  };

  const defaultError = "Couldn't download backup!";

  async function DownloadBackup() {
    try {
      const { data, error } = await GetBackup();

      if (data) {
        downloadFile(JSON.stringify(data), 'json', 'Backup');
      } else {
        errorToast(error?.error ?? defaultError);
      }
    } catch (e) {
      errorToast(defaultError);
    }
  }

  return (
    <>
      <Title title="Settings" />
      <Loading loading={fetchState.loading}>
        <FadeLeft>
          <div className="flex flex-col mb-4 md:mb-0">
            <SubTitle title="Backup" {...{ className: 'text-center mt-4' }} />
            <div className="flex flex-row gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => DownloadBackup()}
                disabled={fetchState.error !== null}
              >
                Download Backup
              </Button>
              <Button variant="outline" className="w-full" disabled>
                Upload Backup
              </Button>
            </div>
          </div>
          <div className="flex flex-col mb-4 md:mb-0">
            <SubTitle
              title="Transactions"
              {...{ className: 'text-center mt-4' }}
            />
            <FileUploadItem
              onUpload={onTransactionsUpload}
              text="Upload Transactions"
              disabled={fetchState.error !== null}
            />
          </div>
        </FadeLeft>
        <FadeUp>
          <div className="flex flex-col lg:flex-row gap-3 justify-center">
            <ContentResultContainer error={fetchState.error}>
              <>
                <div className="flex-grow">
                  <SubTitle
                    title="Budgets"
                    {...{ className: 'text-center mt-4' }}
                  />
                  <BudgetActionMenu
                    table={table}
                    budgets={budgets}
                    onDeleteConfirmed={onDeleteConfirmed}
                    onRefresh={onRefresh}
                  >
                    <CustomTable
                      table={table}
                      canHideRows
                      filtersOnly={false}
                      page="settings"
                    />
                  </BudgetActionMenu>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center flex-grow">
                  <CustomSmallTable
                    title="Types"
                    values={fetchState.types}
                    onAdd={OnTypeAdd}
                    newValue={newType}
                    setNew={setNewType}
                    onDeleteConfirmed={(id) => OnTypeDeleteConfirmed(id)}
                  />
                  <CustomSmallTable
                    title="Owners"
                    values={fetchState.owners}
                    onAdd={() => OnOwnerAdd()}
                    newValue={newOwner}
                    setNew={setNewOwner}
                    onDeleteConfirmed={(id) => OnOwnerDeleteConfirmed(id)}
                  />
                </div>
              </>
            </ContentResultContainer>
          </div>
        </FadeUp>
      </Loading>
    </>
  );
}

export default SettingsPage;
