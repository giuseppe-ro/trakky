import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { afterEach } from 'node:test';
import { QueryClient, QueryClientProvider } from 'react-query';
import DashboardPage from './page';

describe('test BudgetToDeleteList rendering', () => {
  const queryClient = new QueryClient();

  afterEach(() => {
    vi.resetAllMocks();
  });

  beforeEach(() => {
    // act
    render(
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    );
  });

  it('should render filters without table body', async () => {
    // assert
    await waitFor(() => {
      expect(screen.getByTitle('Filters')).toBeVisible();

      expect(screen.getByRole('table').querySelector('thead')).toBeVisible();
      expect(screen.queryByTitle('Hide Table Button')).toBeNull();
    });
  });

  it('should render expenses, users and breakdown charts', async () => {
    // assert
    // expenses chart

    await waitFor(() => {
      expect(screen.getByTitle('Expenses Dashboard')).toBeVisible();

      expect(
        screen
          .getByTitle('Expenses Dashboard')
          .querySelector('button')
          ?.getAttribute('id')
      ).toBe('budgets');

      // // users chart
      expect(screen.getByTitle('Users Dashboard')).toBeVisible();
      //
      expect(
        screen
          .getByTitle('Users Dashboard')
          .querySelector('li')
          ?.querySelector('span')?.textContent
      ).toBe('Goofy');

      // // breakdown chart
      expect(
        screen.getByTitle('Breakdown Dashboard').querySelector('h3')
      ).toHaveTextContent('Breakdown');

      const bars = screen
        .getByTitle('Breakdown Dashboard')
        .children[1].querySelectorAll('path');
      expect(bars.length).toBe(6);
    });
  });
});
