import { ColumnDef } from '@tanstack/react-table';
import { formatCurrency, formatStringDate } from '@/lib/text-formatter';
import { fuzzySort } from '@/lib/filters';
import { EditCell } from '@/components/ui/table/edit-cell';
import { PaymentForm } from '@/components/ui/table/payment-form';
import { Payment, Budget } from '@/models/dtos';
import BudgetForm from '@/app/settings/components/budget-form';

export const PaymentColumnDefinition = (
  refresh: (signal?: AbortSignal, flushPaymentsBeforeRefresh?: boolean) => void
): ColumnDef<Payment, number | string>[] => {
  return [
    {
      accessorKey: 'date',
      enableHiding: true,
      enablePinning: false,
      header: 'date',
      enableColumnFilter: true,
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const formatted = formatStringDate(row.getValue('date'));

        return <div className="text-right font-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: 'type',
      enableHiding: false,
      header: 'Type',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: ({ row }) => {
        return <div className="font-sm">{row.getValue('type')}</div>;
      },
    },
    {
      accessorKey: 'owner',
      enableHiding: false,
      header: 'User',
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      cell: ({ row }) => {
        return <div className="font-sm">{row.getValue('owner')}</div>;
      },
    },
    {
      accessorKey: 'amount',
      enableHiding: false,
      header: 'Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatted = formatCurrency(amount);

        return <div className="text-right w-full font-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: 'description',
      enableHiding: true,
      enableGlobalFilter: false,
      header: 'Description',
      cell: ({ row }) => {
        return <div className="font-sm">{row.getValue('description')}</div>;
      },
    },
    {
      accessorKey: 'id',
      header: 'Id',
      enableGlobalFilter: false,
      cell: ({ row }) => {
        return <div className="text-right font-sm">{row.getValue('id')}</div>;
      },
    },
    {
      id: 'edit',
      enableHiding: false,
      header: () => null,
      cell: ({ row }) => {
        return (
          <div className="flex w-full justify-end">
            <EditCell id={(row.original as Payment).id}>
              <PaymentForm
                editValues={row.original as Payment}
                refresh={refresh}
                title="Edit Transaction"
              />
            </EditCell>
          </div>
        );
      },
    },
  ];
};

export const BudgetColumnDefinition = (
  budgets: Budget[] | null,
  refresh: (flushPaymentsBeforeRefresh: boolean) => void
): ColumnDef<Budget, number | string>[] => {
  return [
    {
      accessorKey: 'date',
      header: 'Date',
      enableColumnFilter: true,
      enableGlobalFilter: false,
      cell: ({ row }) => {
        const formatted = formatStringDate(row.getValue('date'));

        return <div className="text-right font-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: 'budget',
      header: 'Budget',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('budget'));
        const formatted = formatCurrency(amount);

        return <div className="text-right font-sm">{formatted}</div>;
      },
    },
    {
      accessorKey: 'maxBudget',
      header: 'Max Budget',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('maxBudget'));
        const formatted = formatCurrency(amount);

        return <div className="text-right font-sm">{formatted}</div>;
      },
    },
    {
      id: 'edit',
      enableHiding: false,
      header: () => null,
      cell: ({ row }) => {
        return (
          budgets && (
            <div className="flex justify-center">
              <EditCell id={(row.original as Budget).id}>
                <BudgetForm
                  editValues={row.original as Budget}
                  refresh={refresh}
                  title="Edit Budget"
                  existingDates={budgets.map((b) => new Date(b.date))}
                />
              </EditCell>
            </div>
          )
        );
      },
    },
  ];
};

export const colSize = (id: string): number | string => {
  switch (id) {
    case 'select':
      return 50;
    case 'edit':
      return 40;
    case 'date':
      return 90;
    case 'amount':
      return 115;
    default:
      return 100;
  }
};

export const maxColSize = (id: string): number | string => {
  switch (id) {
    case 'select':
      return 50;
    case 'edit':
      return 40;
    default:
      return 1000;
  }
};

export const minColSize = (id: string): number | string => {
  switch (id) {
    case 'owner':
      return 50;
    case 'amount':
      return 100;
    case 'edit':
      return 40;
    default:
      return 10;
  }
};
