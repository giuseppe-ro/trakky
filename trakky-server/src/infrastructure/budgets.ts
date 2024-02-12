import { Budget, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getBudgets() {
  const response = await prisma.budget.findMany({
    orderBy: [
      {
        date: 'desc',
      },
    ],
  });

  return response;
}

export async function addBudgets(budgets: Budget[]) {
  const response = await prisma.budget.createMany({
    data: budgets
  });

  return response;
}

export async function updateBudget(budget: Budget) {

  const response = await prisma.budget.update({
    where: { id: budget.id },
    data: budget,
  });

  console.log(response);

  return response;
}

export async function deleteBudgets(budgetIds: number[]) {
  const response = await prisma.budget.deleteMany({
    where: {
      id: { in: budgetIds },
    },
  });

  console.log(response);

  return response;
}
