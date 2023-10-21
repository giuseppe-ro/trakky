import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getBudgets() {
  const response = await prisma.budget.findMany();

  return response;
}

export async function addBudgets(budgets: any) {
  const response = await prisma.budget.createMany({
    data: budgets
  });

  return response;
}
