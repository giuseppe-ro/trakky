/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { Dictionary } from '@/components/ui/table/icons';
import { DebitorBalance } from '@/models/debitor-balance';
import { Share } from '@/models/share';

export const getDebitorBalances = (balances: Dictionary<number>) => {
  const items = Object.keys(balances).map((key) => {
    return { owner: key, amount: balances[key] };
  });

  items.sort((a, b) => a.amount - b.amount).reverse();

  let total: number = 0;
  const creditors: Dictionary<number> = {};
  const debitors: Dictionary<number> = {};
  const debitorBalances: DebitorBalance[] = [];

  items.forEach((balance) => {
    total += balance.amount;
  });

  const share = Math.floor(total / items.length);

  items.forEach((balance) => {
    if (balance.amount > share) {
      creditors[balance.owner] = Math.floor(balance.amount) - share;
    }

    if (balance.amount < share) {
      debitors[balance.owner] = share - Math.floor(balance.amount);
    }
  });

  for (const debitor in debitors) {
    const debitorBalance: DebitorBalance = { name: debitor, owed: [] };

    while (debitors[debitor] > 1) {
      let debitPaid: number = 0;

      for (const creditor in creditors) {
        if (creditors[creditor] >= debitors[debitor]) {
          debitPaid = debitors[debitor];
          creditors[creditor] -= debitPaid;
        } else {
          debitPaid = creditors[creditor];
          creditors[creditor] = 0;
        }

        debitors[debitor] -= debitPaid;

        if (debitPaid === debitors[debitor]) {
          break;
        }

        if (debitPaid > 0) {
          debitorBalance.owed.push({ to: creditor, amount: debitPaid });
        }
      }
      debitorBalances.push(debitorBalance);
    }
  }

  return {
    totalAmount: total,
    shareAmount: share,
    debitorBalances,
  } as unknown as Share;
};

export default getDebitorBalances;
