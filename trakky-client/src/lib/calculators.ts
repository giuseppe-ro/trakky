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

  let index = 0;

  Object.keys(debitors).forEach((debitor) => {
    const debitorBalance: DebitorBalance = { name: debitor, owed: [] };

    let debitPaid: number = 0;

    Object.keys(creditors).forEach((creditor) => {
      if (debitPaid === debitors[debitor]) {
        return;
      }

      if (creditors[creditor] >= debitors[debitor]) {
        debitPaid = debitors[debitor];
        creditors[creditor] -= debitPaid;
      } else {
        debitPaid = creditors[creditor];
        creditors[creditor] = 0;
      }

      debitors[debitor] -= debitPaid;

      if (debitPaid > 0) {
        index += 1;
        debitorBalance.owed.push({
          to: creditor,
          amount: debitPaid,
          id: index,
        });
      }
    });

    if (debitorBalance.owed.length > 0) {
      debitorBalances.push(debitorBalance);
    }
  });

  return {
    totalAmount: total,
    shareAmount: share,
    debitorBalances,
  } as unknown as Share;
};

export default getDebitorBalances;
