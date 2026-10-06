import { useMemo } from 'react';
import { Table } from '@tanstack/react-table';
import { Dictionary } from '@/components/ui/table/icons';

// eslint-disable-next-line
function useSummary(table: Table<any>) {
  const filteredRows = table.getFilteredRowModel().rows;
  const preFilteredRows = table.getPreFilteredRowModel().rows;

  return useMemo(() => {
    const sum = (rows: typeof filteredRows) =>
      rows.reduce(
        (total, row) => total + parseFloat(row.getValue('amount')),
        0
      );

    const balances: Dictionary<number> = {};

    filteredRows.forEach((row) => {
      const owner = row.getValue('owner') as string;
      balances[owner] =
        (balances[owner] ?? 0) + parseFloat(row.getValue('amount'));
    });

    return {
      totalAmount: sum(preFilteredRows),
      partialTotal: sum(filteredRows),
      balances,
    };
  }, [filteredRows, preFilteredRows]);
}

export default useSummary;
