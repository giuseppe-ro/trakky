import { Containers } from '@/components/ui/containers';
import DeleteDialog from '@/components/ui/table/delete-popup';
import TableActionMenu from '@/components/ui/table/table-action-menu';
import { Payment } from '@/models/dtos';
import { Table } from '@tanstack/react-table';
import { lazy, ReactNode } from 'react';
import PaymentsRecap from '@/components/payments/payments-recap';

const PaymentForm = lazy(() => import('@/components/ui/table/payment-form'));

interface PaymentsTableActionMenuProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>;
  onRefresh: (
    flushPaymentsBeforeRefresh?: boolean,
    signal?: AbortSignal | undefined
  ) => Promise<void>;
  onDeleteConfirmed: () => Promise<void>;
  children: ReactNode;
}

export function PaymentsTableActionMenu({
  table,
  onRefresh,
  onDeleteConfirmed,
  children,
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
          <DeleteDialog
            onDeleteConfirmed={onDeleteConfirmed}
            tooltipText="Delete selected rows"
            entries={
              <PaymentsRecap
                entries={table
                  .getSelectedRowModel()
                  .rows.map((row) => row.original as Payment)}
              />
            }
          />
        }
      >
        {children}
      </TableActionMenu>
    </Containers>
  );
}

export default PaymentsTableActionMenu;
