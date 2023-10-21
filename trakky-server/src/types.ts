import { Type, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTypes() {
  return await prisma.type.findMany();
}

export async function addTypes(type: Type[]) {
  const response = await prisma.type.createMany({
    data: type,
  });

  console.log(response);

  return response;
}

export async function deleteTypes(ids: number[]) {
  const response = await prisma.type.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  console.log(response);

  return response;
}
