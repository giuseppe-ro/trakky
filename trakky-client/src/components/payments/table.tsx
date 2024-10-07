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
    <PaymentsTableActionMenu
      table={table}
      onDeleteConfirmed={onDeleteConfirmed}
      onRefresh={onRefresh}
    >
      <CustomTable table={table} filtersOnly={false} page="overview" />
    </PaymentsTableActionMenu>
  );
}

export default PaymentsTable;
