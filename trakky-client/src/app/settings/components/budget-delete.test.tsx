import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Budget } from '@/models/dtos';
import BudgetToDeleteList from './budget-delete';

describe('test BudgetToDeleteList', () => {
  it('should render one row per budget', () => {
    const entries: Budget[] = [
      { id: '1', date: '2020-01-01', budget: 1000, maxBudget: 2000 },
      { id: '2', date: '2020-01-01', budget: 1000, maxBudget: 2000 },
      { id: '3', date: '2020-01-01', budget: 1000, maxBudget: 2000 },
    ];

    render(<BudgetToDeleteList entries={entries} />);

    expect(screen.getAllByRole('row').length).toBe(entries.length);
  });
});
