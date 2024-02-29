/* eslint-disable @typescript-eslint/no-explicit-any */
import { Containers } from '@/components/ui/containers';
import DeleteDialog from '@/components/ui/table/delete-popup';
import TableActionMenu from '@/components/ui/table/table-action-menu';
import { Table } from '@tanstack/react-table';
import { Budget } from '@/models/dtos';
import { ReactNode } from 'react';
import BudgetForm from './budget-form';
import BudgetToDeleteList from './budget-delete';

interface BudgetActionMenuProps {
  table: Table<any>;
  onRefresh: (flushBeforeRefresh?: boolean) => Promise<void>;
  budgets: Budget[];
  onDeleteConfirmed: () => Promise<void>;
  children: ReactNode;
}

export function BudgetActionMenu({
  table,
  budgets,
  onRefresh,
  onDeleteConfirmed,
  children,
}: BudgetActionMenuProps) {
  return (
    <Containers className="transition">
      <TableActionMenu
        exportName="Budgets"
        table={table}
        onRefresh={onRefresh}
        addForm={
          <BudgetForm
            refresh={() => {
              onRefresh(false).then(() => {});
            }}
            existingDates={budgets.map((b) => new Date(b.date))}
            title="Add New Budget"
          />
        }
        deleteForm={
          <DeleteDialog
            onDeleteConfirmed={onDeleteConfirmed}
            entries={BudgetToDeleteList({
              entries: table
                .getSelectedRowModel()
                .rows.map((row) => row.original),
            })}
          />
        }
      >
        {children}
      </TableActionMenu>
    </Containers>
  );
}

export default BudgetActionMenu;
