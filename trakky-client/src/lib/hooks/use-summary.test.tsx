import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Payment } from '@/models/dtos';
import { usePaymentsTable } from '@/lib/hooks/table-hooks';
import useSummary from '@/lib/hooks/use-summary';

function payment(owner: string, amount: number): Payment {
  return {
    id: `${owner}-${amount}`,
    owner,
    amount,
    type: 'Food',
    description: 'test',
    date: '2025-03-10',
  };
}

describe('useSummary', () => {
  it('recomputes balances when a net-zero settlement pair is added', () => {
    const { result, rerender } = renderHook(
      ({ rows }: { rows: Payment[] }) => {
        const { table } = usePaymentsTable({
          data: rows,
          selectedYear: '2025',
          selectedMonth: 'March',
          refreshData: () => Promise.resolve(),
          isLoading: false,
        });
        return useSummary(table);
      },
      { initialProps: { rows: [payment('A', 100), payment('B', 40)] } }
    );

    expect(result.current.balances).toEqual({ A: 100, B: 40 });
    expect(result.current.partialTotal).toBe(140);

    rerender({
      rows: [
        payment('A', 100),
        payment('B', 40),
        payment('A', -30),
        payment('B', 30),
      ],
    });

    expect(result.current.balances).toEqual({ A: 70, B: 70 });
    expect(result.current.partialTotal).toBe(140);
    expect(result.current.totalAmount).toBe(140);
  });
});
