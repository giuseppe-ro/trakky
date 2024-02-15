/* eslint-disable @typescript-eslint/no-explicit-any */
import { Containers } from '@/components/ui/containers';
import { DeletePaymentsDialog } from '@/components/ui/table/delete-popup';
import PaymentForm from '@/components/ui/table/payment-form';
import TableActionMenu from '@/components/ui/table/table-action-menu';
import { Payment } from '@/models/dtos';
import { Table } from '@tanstack/react-table';

interface PaymentsTableActionMenuProps {
  table: Table<any>;
  onRefresh: (
    flushPaymentsBeforeRefresh?: boolean,
    signal?: AbortSignal | undefined
  ) => Promise<void>;
  onDeleteConfirmed: () => Promise<void>;
}

export function PaymentsTableActionMenu({
  table,
  onRefresh,
  onDeleteConfirmed,
}: PaymentsTableActionMenuProps) {
  return (
    <Containers className="transition">
      <TableActionMenu
        exportName="Payments"
        table={table}
        onRefresh={onRefresh}
        addForm={
          <PaymentForm
            refresh={() => onRefresh(false)}
            title="Add New Transaction"
          />
        }
        deleteForm={
          <DeletePaymentsDialog
            onDeleteConfirmed={onDeleteConfirmed}
            entries={table
              .getSelectedRowModel()
              .rows.map((row) => row.original as Payment)}
          />
        }
      />
    </Containers>
  );
}

export default PaymentsTableActionMenu;
