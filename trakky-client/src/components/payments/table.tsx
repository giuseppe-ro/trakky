/* eslint-disable @typescript-eslint/no-explicit-any */
import Spinner from '@/components/ui/spinner';
import { CustomTable } from '@/components/ui/table/table';
import { Table } from '@tanstack/react-table';
import { ReactNode } from 'react';
import PaymentsTableActionMenu from './action-menu';

export function ActionMenuLoadingFallback(): ReactNode {
  return <Spinner className="flex justify-center align-middle m-16" />;
}

interface PaymnentsTableProps {
  table: Table<any>;
  onRefresh: (
    flushPaymentsBeforeRefresh?: boolean,
    signal?: AbortSignal | undefined
  ) => Promise<void>;
  onDeleteConfirmed: () => Promise<void>;
}

export function PaymentsTable({
  table,
  onRefresh,
  onDeleteConfirmed,
}: PaymnentsTableProps) {
  return (
    <CustomTable
      table={table}
      canHideRows
      filtersOnly={false}
      page="overview"
      tableActionMenu={
        <PaymentsTableActionMenu
          table={table}
          onDeleteConfirmed={onDeleteConfirmed}
          onRefresh={onRefresh}
        />
      }
    />
  );
}

export default PaymentsTable;
