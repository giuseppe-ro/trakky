import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { afterEach } from 'node:test';
import * as paymentsHooks from '@/lib/hooks/payments-hooks';
import * as useDashboard from '@/lib/hooks/use-dashboard';
import { ReactNode } from 'react';
import DashboardPage from './page';

vi.mock('recharts', async (importOriginal) => {
  const originalModule = (await importOriginal()) as Record<string, unknown>;
  return {
    ...originalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => children,
  };
});

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

describe('test BudgetToDeleteList', () => {
  const usePaymentDataSpy = vi.spyOn(paymentsHooks, 'usePaymentData');
  const useFilteredPaymentsSpy = vi.spyOn(paymentsHooks, 'useFilteredPayments');
  const useDashboardSpy = vi.spyOn(useDashboard, 'default');

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

  it('should render sticky year selection on the top', () => {
    // arrange
    usePaymentDataSpy.mockReturnValue({
      payments: [],
      availableYears: ['2020', '2021', '2022'], // Mocked availableYears value
      selectedYear: '2021',
      refreshData: async () => undefined,
      setSelectedYear: async () => undefined,
    });

    // act
    render(<DashboardPage />);

    // assert
    expect(screen.getAllByRole('combobox')[0]).toHaveTextContent('2021');
  });

  it('should render filters without table body', () => {
    // act
    render(<DashboardPage />);

    // assert
    expect(screen.getByTitle('Filters')).toBeVisible();

    expect(screen.getByRole('table').querySelector('thead')).toBeVisible();
    expect(screen.getByRole('table').querySelector('tbody')).toBeNull();
  });

  it('should render expenses, users and breakdown charts', () => {
    // arrange

    useFilteredPaymentsSpy.mockReturnValue([
      {
        id: '1',
        amount: 100,
        type: 'type',
        owner: 'Joe',
        description: 'description',
        date: 'date',
      },
    ]);

    usePaymentDataSpy.mockReturnValue({
      payments: [],
      availableYears: ['2020', '2021', '2022'], // Mocked availableYears value
      selectedYear: '2021',
      refreshData: async () => undefined,
      setSelectedYear: async () => undefined,
    });

    const expensesBreakdown = [
      {
        name: 'Bills',
        value: 1237,
      },
    ];

    useDashboardSpy.mockReturnValue({
      filteredData: [],
      paymentOverviews: [
        {
          budget: 2315,
          index: 0,
          maxBudget: 3600,
          name: 'Jan',
          total: 1799,
        },
      ],
      ownersOverview: [
        {
          index: 0,
          name: 'Jan',
          owners: {
            Donald: 1270,
            Goofy: 529,
          },
        },
        {
          index: 1,
          name: 'Feb',
          owners: {
            Donald: 199,
          },
        },
      ],
      expensesBreakdown,
    });

    // act
    render(<DashboardPage />);

    // assert
    // expenses chart
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
    ).toBe('Donald');

    // // breakdown chart
    expect(
      screen.getByTitle('Breakdown Dashboard').querySelector('h3')
    ).toHaveTextContent('Breakdown');

    const bars = screen
      .getByTitle('Breakdown Dashboard')
      .children[1].querySelectorAll('path');
    expect(bars.length).toBe(expensesBreakdown.length);
  });
});
