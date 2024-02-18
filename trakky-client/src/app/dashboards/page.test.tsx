import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { afterEach } from 'node:test';
import DashboardPage from './page';

describe('test BudgetToDeleteList rendering', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render title', () => {
    // act
    render(<DashboardPage />);

    // assert
    expect(screen.getByTitle('Dashboards')).toBeVisible();
    expect(screen.getByText('Dashboards').parentElement?.ariaLabel).toBe(
      'Title'
    );
  });

  it('should render sticky year selection on the top', async () => {
    // act
    render(<DashboardPage />);

    // assert
    await waitFor(() => {
      expect(screen.getAllByRole('combobox')[0]).toHaveTextContent('2023');
    });
  });

  it('should render filters without table body', async () => {
    // act
    render(<DashboardPage />);

    // assert
    await waitFor(() => {
      expect(screen.getByTitle('Filters')).toBeVisible();

      expect(screen.getByRole('table').querySelector('thead')).toBeVisible();
      expect(screen.queryByTitle('Hide Table Button')).toBeNull();
    });
  });

  it('should render expenses, users and breakdown charts', async () => {
    // act
    render(<DashboardPage />);

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
