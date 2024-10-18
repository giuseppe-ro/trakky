import { useEffect, useState } from 'react';
import { Table } from '@tanstack/react-table';
import { Dictionary } from '@/components/ui/table/icons';

// eslint-disable-next-line
function useSummary(table: Table<any>, selectedYear: string | null) {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [partialTotal, setPartialTotal] = useState<number>(0);
  const [balances, setBalances] = useState<Dictionary<number>>();

  const amountPartialSum = table
    .getFilteredRowModel()
    .rows.map((r) => parseFloat(r.getValue('amount')))
    .reduce((total, currentAmount) => total + currentAmount, 0);

  useEffect(() => {
    const amountSum = table
      .getPreFilteredRowModel()
      .rows.map((r) => parseFloat(r.getValue('amount')))
      .reduce((total, currentAmount) => total + currentAmount, 0);

    setTotalAmount(amountSum);
    setPartialTotal(amountPartialSum);

    const balancesDict: Dictionary<number> = {};

    table
      .getFilteredRowModel()
      .rows.map((r) => ({
        amount: parseFloat(r.getValue('amount')),
        owner: r.getValue('owner') as string,
      }))
      .forEach((item) => {
        if (!(item.owner in balancesDict)) {
          balancesDict[item.owner] = 0;
        }
        balancesDict[item.owner] += item.amount;
      });

    setBalances(balancesDict);
    // eslint-disable-next-line
  }, [selectedYear, amountPartialSum]);

  return {
    totalAmount,
    partialTotal,
    balances,
    setBalances,
  };
}

export default useSummary;
