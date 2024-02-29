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
  canHideRows?: boolean;
}

export function PaymentsTable({
  table,
  onRefresh,
  onDeleteConfirmed,
  canHideRows,
}: PaymentsTableProps) {
  return (
    <PaymentsTableActionMenu
      table={table}
      onDeleteConfirmed={onDeleteConfirmed}
      onRefresh={onRefresh}
    >
      <CustomTable
        table={table}
        canHideRows={canHideRows}
        filtersOnly={false}
        page="overview"
      />
    </PaymentsTableActionMenu>
  );
}

export default PaymentsTable;

PaymentsTable.defaultProps = {
  canHideRows: true,
};
