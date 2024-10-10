import { TableRow } from '@/components/ui/table';
import { formatCurrency } from '@/lib/text-formatter';
import { Budget } from '@/models/dtos';
import { twMerge } from 'tailwind-merge';

function BudgetToDeleteList({ entries }: BudgetToDeleteListProps) {
  const tdStyle =
    'px-2 text-left border overflow-x-scroll scroll-smooth  w-[100px]';

  return (
    <div className="m-6">
      <table className="w-full max-w-full">
        <tbody className="w-full">
          {entries.map((budget) => (
            <TableRow
              key={budget.id}
              className="flex w-full border-none align-middle justify-center"
            >
              <td className={twMerge(tdStyle, 'text-left')}>
                {new Date(budget.date).toLocaleString('en-GB', {
                  month: 'numeric',
                  year: 'numeric',
                })}
              </td>
              <td className={twMerge(tdStyle, 'text-right overflow-auto')}>
                {formatCurrency(budget.budget)}
              </td>
              <td className={twMerge(tdStyle, 'text-right overflow-auto')}>
                {formatCurrency(budget.maxBudget)}
              </td>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface BudgetToDeleteListProps {
  entries: Budget[];
}

export default BudgetToDeleteList;
