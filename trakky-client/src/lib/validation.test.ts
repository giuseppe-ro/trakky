import { describe, expect, it } from 'vitest';

import { uploadPaymentSchema, uploadPaymentsSchema } from './validation';

const row = {
  owner: 'a',
  type: 'b',
  date: '2024-01-31',
  amount: 5,
  description: 'd',
};

describe('uploadPaymentSchema date rule', () => {
  it.each(['', '31/01/2024', 'nope', 12345, null, undefined])(
    'rejects %p as a date without throwing',
    (date) => {
      const result = uploadPaymentSchema.safeParse({ ...row, date });
      expect(result.success).toBe(false);
    }
  );

  it('accepts an ISO date string or Date and parses it into a Date', () => {
    expect(uploadPaymentSchema.parse(row).date).toEqual(new Date('2024-01-31'));
    expect(uploadPaymentSchema.parse(row).date).toBeInstanceOf(Date);
    expect(
      uploadPaymentSchema.parse({ ...row, date: '2024-01-31T10:00:00.000Z' })
        .date
    ).toEqual(new Date('2024-01-31T10:00:00.000Z'));
    expect(
      uploadPaymentSchema.parse({ ...row, date: new Date('2024-01-31') }).date
    ).toEqual(new Date('2024-01-31'));
  });

  it('keeps the other row rules', () => {
    expect(uploadPaymentSchema.safeParse({ ...row, amount: 0 }).success).toBe(
      false
    );
    expect(
      uploadPaymentSchema.safeParse({ ...row, description: 'x'.repeat(51) })
        .success
    ).toBe(false);
  });
});

describe('uploadPaymentsSchema', () => {
  it('rejects an empty file and a file with one bad date', () => {
    expect(uploadPaymentsSchema.safeParse([]).success).toBe(false);
    expect(
      uploadPaymentsSchema.safeParse([{ ...row, date: '31/01/2024' }]).success
    ).toBe(false);
  });

  it('accepts a list of conforming rows', () => {
    expect(
      uploadPaymentsSchema.parse([row, { ...row, date: '2024-02-01' }])
    ).toHaveLength(2);
  });
});
