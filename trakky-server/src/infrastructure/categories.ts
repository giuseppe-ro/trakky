import { Category, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCategories() {
  return await prisma.category.findMany();
}

export async function addCategory(category: Category) {
  console.log('type: ', category)

  try {
    const response = await prisma.category.create({
      data: {
        iconId: category.iconId,
        name: category.name
      },
    });
  
    console.log('response', response);
    return response;
  } catch(e) {
    console.log("something went wrong", e);
  }

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
