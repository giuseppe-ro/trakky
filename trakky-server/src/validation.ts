import * as z from "zod";

// Write-payload schemas for every POST/PUT/DELETE route. Standalone on purpose: no imports
// from api/ or infrastructure/, so the routes and the Prisma layer share one definition.
// zod strips unknown keys and no create schema declares `id`, so a caller-supplied `id`
// can never reach Prisma on an insert.

const name = z.string().min(1).max(100);
const isoDate = z.string().min(1); // issue 06 replaces this line only
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

export const namedRow = z.object({ name }); // owners + types
export const namedList = z.array(namedRow).min(1).max(rowCap);

export const categoryCreate = z.object({ name, iconId: z.number().int().positive() });
export const categoryList = z.array(categoryCreate).min(1).max(rowCap);

export const ids = z.array(rowId).min(1).max(rowCap);
