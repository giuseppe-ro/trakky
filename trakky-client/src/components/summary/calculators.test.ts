import { describe, expect, it } from 'vitest';
import {
  calculatePercentageDiff,
  getPreviousYearTotal,
  getTotalForDate as getTotalUntilDate,
} from './calculators';

describe('test calculatePercentageDiff', () => {
  it('should return 0 when previous is undefined or 0', () => {
    // arrange
    const testCases = [
      { current: 1, previous: 0 },
      { current: 1, previous: undefined },
    ];

    // assert
    testCases.forEach(({ current, previous }) => {
      expect(calculatePercentageDiff(current, previous!)).toBe(0);
    });
  });

  it('returns correct percentage change from current to previous', () => {
    // arrange
    const testCases = [
      { current: 10, previous: 1, expectedResult: 900 },
      { current: 1, previous: 10, expectedResult: -90 },
      { current: 1, previous: 1, expectedResult: 0 },
    ];

    // assert
    testCases.forEach(({ current, previous, expectedResult }) => {
      expect(calculatePercentageDiff(current, previous!)).toBe(expectedResult);
    });
  });
});

describe('test getTotalForDate', () => {
  it('should return 0 when there are no totals for date', () => {
    // arrange
    const testCases = [
      { totals: [], untilDate: new Date() },
      {
        totals: [{ amount: 100, number: 1, date: new Date('2024-01-01') }],
        untilDate: new Date('2023-01-01'),
      },
    ];

    // expect
    testCases.forEach(({ totals, untilDate }) => {
      expect(getTotalUntilDate(totals, untilDate, 0)).toBe(0);
    });
  });

  it('should ignore totals with no date', () => {
    // arrange
    const testCases = [
      {
        totals: [{ amount: 100, number: 1, date: undefined }],
        untilDate: new Date('2023-01-01'),
        expectedResult: 0,
      },
      {
        totals: [
          { amount: 100, number: 1, date: undefined },
          { amount: 100, number: 2, date: new Date('2023-01-01') },
        ],
        untilDate: new Date('2023-01-01'),
        expectedResult: 100,
      },
    ];

    // assert
    testCases.forEach(({ totals, untilDate, expectedResult }) => {
      expect(getTotalUntilDate(totals!, untilDate, 0)).toBe(expectedResult);
    });
  });

  it('should return totals, up to the specified date', () => {
    // arrange
    const testCases = [
      {
        totals: [
          { amount: 100, number: 1, date: new Date('2023-01-01') },
          { amount: 100, number: 2, date: new Date('2022-01-01') },
          { amount: 100, number: 3, date: new Date('2023-02-01') },
          { amount: 100, number: 4, date: new Date('2024-01-01') },
        ],
        untilDate: new Date('2023-11-01'),
        expectedResult: 200,
      },
    ];

    // expect
    testCases.forEach(({ totals, untilDate, expectedResult }) => {
      expect(getTotalUntilDate(totals, untilDate, 0)).toBe(expectedResult);
    });
  });
});

describe('test getPreviousYearTotal', () => {
  it('should return previous year total', () => {
    // arrange
    const testCases = [
      {
        totals: [
          { amount: 100, number: 1, date: new Date('2023-01-01') },
          { amount: 100, number: 2, date: new Date('2022-01-01') },
          { amount: 100, number: 3, date: new Date('2023-02-01') },
          { amount: 100, number: 4, date: new Date('2024-01-01') },
        ],
        year: '2024',
        expectedResult: 200,
      },
    ];

    // assert
    testCases.forEach(({ totals, year, expectedResult }) => {
      expect(getPreviousYearTotal(totals, year, 0)).toBe(expectedResult);
    });
  });

  it('should return previous year total', () => {
    // arrange
    const testCases = [
      {
        totals: [
          { amount: 100, number: 1, date: new Date('2023-01-01') },
          { amount: 100, number: 2, date: new Date('2022-01-01') },
          { amount: 100, number: 3, date: new Date('2023-02-01') },
          { amount: 100, number: 4, date: new Date('2024-01-01') },
        ],
        year: '2024',
        expectedResult: 200,
      },
    ];

    // assert
    testCases.forEach(({ totals, year, expectedResult }) => {
      expect(getPreviousYearTotal(totals, year, 0)).toBe(expectedResult);
    });
  });

  it('should ignore totals with no date', () => {
    // arrange
    const testCases = [
      {
        totals: [{ amount: 100, number: 1, date: undefined }],
        year: '2000',
        expectedResult: 0,
      },
      {
        totals: [
          { amount: 100, number: 1, date: undefined },
          { amount: 100, number: 2, date: new Date('2021-01-01') },
        ],
        year: '2022',
        expectedResult: 100,
      },
    ];

    // assert
    testCases.forEach(({ totals, year, expectedResult }) => {
      expect(getPreviousYearTotal(totals!, year, 0)).toBe(expectedResult);
    });
  });
});
