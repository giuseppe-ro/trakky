import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Payment } from '@/models/dtos';
import { useYearSelection } from '@/lib/hooks/payments-hooks';

const payments: Payment[] = [
  {
    id: '1',
    owner: 'A',
    amount: 10,
    type: 'Food',
    description: 'test',
    date: '2025-03-10',
  },
];

describe('useYearSelection', () => {
  it('keeps the selected month when payments are refetched', () => {
    const { result, rerender } = renderHook(
      ({ rows }: { rows: Payment[] }) =>
        useYearSelection({ payments: rows, isLoading: false }),
      { initialProps: { rows: payments } }
    );

    act(() => result.current.setSelectedMonth('March'));
    rerender({ rows: payments.map((p) => ({ ...p })) });

    expect(result.current.selectedMonth).toBe('March');
  });
});
