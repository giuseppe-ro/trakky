import { Category } from "@prisma/client";
import prisma from "./client";

export async function get() {
  return await prisma.category.findMany();
}

export async function post(categories: Category[]) {
    const response = await prisma.category.createMany({
      data: categories
    });
  
    return response;
}

export async function del(ids: number[]) {
  const response = await prisma.category.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  console.log(response);

  return response;
}
