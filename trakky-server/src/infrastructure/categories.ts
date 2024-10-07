import { Category, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCategories() {
  return await prisma.category.findMany();
}

export async function addCategories(categories: Category[]) {
    const response = await prisma.category.createMany({
      data: categories
    });
  
    return response;
}

export async function deleteCategories(ids: number[]) {
  const response = await prisma.category.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  console.log(response);

  return response;
}
