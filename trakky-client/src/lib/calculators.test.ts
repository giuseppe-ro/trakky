import { describe, expect, it } from 'vitest';

import getDebitorBalances from './calculators';

describe('getDebitorBalances', () => {
  it('settles sub-unit balances as a single exact transfer', () => {
    const balances = { A: 50, B: -50 };

    expect(getDebitorBalances(balances)).toEqual({
      totalAmount: 0,
      shareAmount: 0,
      debitorBalances: [{ name: 'B', owed: [{ to: 'A', amount: 50, id: 1 }] }],
    });
    expect(balances).toEqual({ A: 50, B: -50 });
  });

  it('keeps pence instead of flooring to whole units', () => {
    const result = getDebitorBalances({ A: 1010, B: -1010 });

    expect(result.debitorBalances[0].owed[0].amount).toBe(1010);
  });

  it('splits several debts without over-crediting anyone', () => {
    const result = getDebitorBalances({ A: 200, B: -50, C: -150 });

    expect(result.debitorBalances).toEqual([
      { name: 'B', owed: [{ to: 'A', amount: 50, id: 1 }] },
      { name: 'C', owed: [{ to: 'A', amount: 150, id: 2 }] },
    ]);
  });

  it('distributes an indivisible pence remainder without losing money', () => {
    const result = getDebitorBalances({ A: 100, B: -50, C: -49 });
    const paid = result.debitorBalances.flatMap((debt) => debt.owed);

    expect(paid.reduce((sum, debt) => sum + debt.amount, 0)).toBe(99);
    expect(paid.map((debt) => debt.amount).sort((a, b) => b - a)).toEqual([
      50, 49,
    ]);
  });

  it('returns no transfers for empty or zero balances', () => {
    expect(getDebitorBalances({})).toEqual({
      totalAmount: 0,
      shareAmount: 0,
      debitorBalances: [],
    });
    expect(getDebitorBalances({ A: 0, B: 0 }).debitorBalances).toEqual([]);
  });

  it('does not mutate the input dictionary', () => {
    const balances = Object.freeze({ A: 300, B: -100, C: -200 });

    getDebitorBalances(balances);

    expect(balances).toEqual({ A: 300, B: -100, C: -200 });
  });
});
