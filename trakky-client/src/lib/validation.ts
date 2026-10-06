import * as z from 'zod';

// Parity with trakky-server/src/validation.ts:isoDate. z.coerce.date() alone turns 12345 and null
// into 1970 dates, and on zod 3.22.4 a .refine() after the .pipe() runs with the raw value, so
// safeParse('') would throw instead of returning a failure.
export const uploadPaymentSchema = z.object({
  owner: z.string().min(1),
  type: z.string().min(1),
  date: z.union([z.string().min(1), z.date()]).pipe(z.coerce.date()),
  amount: z.number().refine((val) => val !== 0, { message: 'cannot be 0' }),
  description: z.string().min(1).max(50),
});

export const uploadPaymentsSchema = z.array(uploadPaymentSchema).min(1);
