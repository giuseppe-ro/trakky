import * as z from 'zod';

// Pre-check for an uploaded payments file, in its own module so it can be imported by a test
// (table-hooks.ts used to carry an inline copy of it).

// Date rule is the server's rule (trakky-server/src/validation.ts): the union is what rejects
// `12345` and `null` — z.coerce.date() alone would store them as 1970-01-01 and the epoch.
// No .refine() may follow the .pipe() on zod 3.22.4: with the union member failed, the refine
// runs with the raw value, so safeParse('') throws `d.getTime is not a function`.
export const uploadPaymentSchema = z.object({
  owner: z.string().min(1),
  type: z.string().min(1),
  date: z.union([z.string().min(1), z.date()]).pipe(z.coerce.date()),
  amount: z.number().refine((val) => val !== 0, { message: 'cannot be 0' }),
  description: z.string().min(1).max(50),
});

export const uploadPaymentsSchema = z.array(uploadPaymentSchema).min(1);
