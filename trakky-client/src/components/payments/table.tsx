/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomTable } from '@/components/ui/table/table';
import { Table } from '@tanstack/react-table';
import PaymentsTableActionMenu from './action-menu';

interface PaymentsTableProps {
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
}: PaymentsTableProps) {
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
