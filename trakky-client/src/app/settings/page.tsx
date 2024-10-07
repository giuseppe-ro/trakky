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
import { FileUploadItem } from '@/components/ui/table/file-upload';
import {
  FetchActionType,
  FETCH_INITIAL_STATE,
  paymentFormDataReducer,
} from '@/components/ui/table/payment-form-reducer';
import { Category, Owner, Budget } from '@/models/dtos';
import { ContentResultContainer } from '@/components/ui/containers';
import Loading from '@/components/ui/loading';
import AddComponent from '@/components/ui/add-input';
import { ChildrenSelection } from '@/components/ui/select';
import { CategoryIcon, IconIdMap } from '@/components/ui/table/icons';
import { Client, GetBackup, GetIcons } from '@/infrastructure/client-injector';
import { ErrorMessage } from '@/infrastructure/remote/base';
import { Endpoint } from '@/constants';
import BudgetActionMenu from './components/budget-action-menu';

function SettingsPage() {
  const [selectedChildValue, setSelectedChildValue] = useState<string>(
    Object.keys(CategoryIcon)[0]
  );

  const [budgets, setBudgets] = useState<Budget[]>([]);
  async function refreshData(
    flushBeforeRefresh: boolean = true,
    signal?: AbortSignal
  ) {
    if (flushBeforeRefresh) setBudgets([]);

    const { data, error } = await Client.Get(Endpoint.Budgets, signal);

    if (error) throw new Error(error.error);

    setBudgets(data as Budget[]);
  }

  const { table, onDeleteConfirmed, onRefresh } = useBudgetsTable({
    data: budgets,
    refreshData,
  });
  const [newCategory, setNewCategory] = useState<string>('');
  const [newOwner, setNewOwner] = useState<string>('');
  const [fetchState, fetchDispatch] = useReducer(
    paymentFormDataReducer,
    FETCH_INITIAL_STATE
  );

  const fetchOwners = async (signal?: AbortSignal) => {
    if (fetchState.error) return;

    const { data: ownersData, error: ownersError } = await Client.Get(
      Endpoint.Owners,
      signal
    );
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

  const fetchCategories = async (signal?: AbortSignal) => {
    if (fetchState.error) return;

    const { data: categoriesData, error: categoriesError } = await Client.Get(
      Endpoint.Categories,
      signal
    );

    if (categoriesError) {
      fetchDispatch({
        type: FetchActionType.FETCH_ERROR,
        payload: categoriesError,
      });
      return;
    }

    fetchDispatch({
      type: FetchActionType.FETCHED_CATEGORIES,
      payload: categoriesData,
    });
  };

  const fetchIcons = async () => {
    if (fetchState.error) return;

    const { data: iconData, error: iconError } = await GetIcons();
    if (iconError) {
      fetchDispatch({
        type: FetchActionType.FETCH_ERROR,
        payload: iconError,
      });
      return;
    }

    fetchDispatch({
      type: FetchActionType.FETCHED_ICONS,
      payload: iconData,
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchData() {
      fetchDispatch({ type: FetchActionType.FETCH_START });

      await fetchOwners(signal);
      await fetchCategories(signal);
      await fetchIcons();
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

  const OnCategoryAdd = async () => {
    if (
      newCategory.length === 0 ||
      valueExistsToast(
        fetchState.categories.map((o: Category) => o.name),
        newCategory
      )
    ) {
      return;
    }

    const id = IconIdMap[selectedChildValue];

    const categoryToAdd = [
      {
        name: newCategory,
        iconId: id,
      },
    ] as Category[];

    const { data: success } = await Client.Post(
      Endpoint.Categories,
      categoryToAdd
    );

    successFailToast({
      success,
      successMessage: 'Type added',
      errorMessage: "Couldn't save Type!",
    });

    await fetchCategories();
  };

  async function OnCategoryDeleteConfirmed(id: number) {
    const { data: success } = await Client.Delete(Endpoint.Categories, [id]);
    await fetchCategories();
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
    const { data: success } = await Client.Post(Endpoint.Owners, [
      { name: newOwner } as Owner,
    ]);
    await fetchOwners();
    successFailToast({
      success,
      successMessage: 'Owner added',
      errorMessage: "Couldn't save Owner!",
    });
  };

  const OnOwnerDeleteConfirmed = async (id: number) => {
    const { data: success } = await Client.Delete(Endpoint.Owners, [id]);
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

  async function DownloadBackup() {
    const defaultError = "Couldn't download backup!";

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
          <div className="flex flex-col gap-3 justify-center">
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
                    values={fetchState.categories}
                    onDeleteConfirmed={(id) => OnCategoryDeleteConfirmed(id)}
                    addComponent={
                      <AddComponent
                        onAdd={OnCategoryAdd}
                        setNew={setNewCategory}
                        childrenSelection={
                          <ChildrenSelection
                            value={selectedChildValue}
                            onChange={setSelectedChildValue}
                            options={CategoryIcon}
                            {...{
                              className:
                                'rounded-none focus:ring-slate-900 focus:outline-none focus:shadow-none w-20 overscroll-contain bg-gray-950 h-8',
                            }}
                          />
                        }
                      />
                    }
                  />
                  <CustomSmallTable
                    title="Owners"
                    values={fetchState.owners}
                    onDeleteConfirmed={(id) => OnOwnerDeleteConfirmed(id)}
                    addComponent={
                      <AddComponent onAdd={OnOwnerAdd} setNew={setNewOwner} />
                    }
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
