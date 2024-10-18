import { Budget } from "@prisma/client";
import prisma from "./client";

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

export async function post(budgets: Budget[]) {
  const response = await prisma.budget.createMany({
    data: budgets
  });

  return response;
}

export async function put(budget: Budget) {

  const response = await prisma.budget.update({
    where: { id: budget.id },
    data: budget,
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
