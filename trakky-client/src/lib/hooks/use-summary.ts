import { useEffect, useState } from 'react';
import { OwnerBalance } from '@/models/owner-balance';
import { Table } from '@tanstack/react-table';

// eslint-disable-next-line
function useSummary(table: Table<any>, selectedYear: string | null) {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [partialTotal, setPartialTotal] = useState<number>(0);
  const [ownerBalances, setOwnerBalances] = useState<OwnerBalance[]>([]);

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

    const balances: OwnerBalance[] = [];

    table
      .getFilteredRowModel()
      .rows.map((r) => ({
        amount: parseFloat(r.getValue('amount')),
        owner: r.getValue('owner'),
      }))
      .forEach((item) => {
        const existingOwnerBalance = balances.find(
          (balance) => balance.owner === item.owner
        );
        if (existingOwnerBalance) {
          existingOwnerBalance.amount += item.amount;
        } else {
          balances.push({
            owner: item.owner as string,
            amount: item.amount,
          });
        }
      });

    const sort = (a: OwnerBalance, b: OwnerBalance) => {
      return a.owner.localeCompare(b.owner);
    };

    setOwnerBalances(balances.sort(sort));
    // eslint-disable-next-line
  }, [selectedYear, amountPartialSum]);

  return {
    totalAmount,
    partialTotal,
    ownerBalances,
  };
}

export default useSummary;
