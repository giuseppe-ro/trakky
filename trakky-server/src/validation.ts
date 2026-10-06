import * as z from "zod";

const name = z.string().min(1).max(100);

// z.coerce.date() alone turns 12345 and null into 1970 dates, and on zod 3.22.4 a .refine() after
// this .pipe() runs with the raw value, so safeParse("") throws instead of returning a failure.
export const isoDate = z.union([z.string().min(1), z.date()]).pipe(z.coerce.date());
const rowId = z.number().int().positive();
const rowCap = 500;

export const paymentCreate = z.object({
  owner: name,
  type: name,
  date: isoDate,
  amount: z.number().refine((v) => v !== 0 && Number.isFinite(v), "cannot be 0"),
  description: z.string().min(1).max(50),
});
export const paymentList = z.array(paymentCreate).min(1).max(rowCap);
export const paymentUpdate = paymentCreate.extend({ id: rowId });

export const budgetCreate = z.object({
  date: isoDate,
  budget: z.number().refine((v) => Number.isFinite(v)),
  maxBudget: z.number().refine((v) => Number.isFinite(v)),
});
export const budgetList = z.array(budgetCreate).min(1).max(rowCap);
export const budgetUpdate = budgetCreate.extend({ id: rowId });

export const namedRow = z.object({ name });
export const namedList = z.array(namedRow).min(1).max(rowCap);

export const categoryCreate = z.object({ name, iconId: z.number().int().positive() });
export const categoryList = z.array(categoryCreate).min(1).max(rowCap);

export const ids = z.array(rowId).min(1).max(rowCap);
