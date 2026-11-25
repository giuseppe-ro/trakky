import { Dictionary } from '@/components/ui/table/icons';
import { DebitorBalance } from '@/models/debitor-balance';
import { Share } from '@/models/share';

export const getDebitorBalances = (balances: Dictionary<number>) => {
  const items = Object.keys(balances).map((key) => ({
    owner: key,
    amount: balances[key],
  }));
  items.sort((a, b) => b.amount - a.amount);

  const total = items.reduce((sum, item) => sum + item.amount, 0);
  const share = items.length > 0 ? Math.floor(total / items.length) : 0;
  // Spread the leftover pence over the first balances so credits always equal debts.
  const remainder = total - share * items.length;

  const creditors: Dictionary<number> = {};
  const debitors: Dictionary<number> = {};
  const debitorBalances: DebitorBalance[] = [];

  items.forEach((item, index) => {
    const target = share + (index < remainder ? 1 : 0);

    if (item.amount > target) {
      creditors[item.owner] = item.amount - target;
    }

    if (item.amount < target) {
      debitors[item.owner] = target - item.amount;
    }
  });

  let index = 0;

  Object.keys(debitors).forEach((debitor) => {
    let owed = debitors[debitor];
    const debitorBalance: DebitorBalance = { name: debitor, owed: [] };

    Object.keys(creditors).forEach((creditor) => {
      if (owed === 0) {
        return;
      }

      const paid = Math.min(owed, creditors[creditor]);
      creditors[creditor] -= paid;
      owed -= paid;

      if (paid > 0) {
        index += 1;
        debitorBalance.owed.push({
          to: creditor,
          amount: paid,
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
