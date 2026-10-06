import { Prisma } from "@prisma/client";
import prisma from "./client";

// The id comes from the database, never from the request (see infrastructure/payments.ts).
type BudgetCreate = Omit<Prisma.BudgetCreateManyInput, "id">;
type BudgetUpdate = BudgetCreate & { id: number };

export async function get() {
  const response = await prisma.budget.findMany({
    orderBy: [
      {
        date: 'desc',
      },
    ],
  });

  return response;
}

export async function post(budgets: BudgetCreate[]) {
  const response = await prisma.budget.createMany({
    data: budgets
  });

  return response;
}

export async function put(budget: BudgetUpdate) {
  const { id, ...data } = budget;

  const response = await prisma.budget.update({
    where: { id },
    data,
  });

  console.log(response);

  return response;
}

export async function del(budgetIds: number[]) {
  const response = await prisma.budget.deleteMany({
    where: {
      id: { in: budgetIds },
    },
  });

  console.log(response);

  return response;
}
