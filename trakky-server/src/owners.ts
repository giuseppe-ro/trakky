import { Owner, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getOwners() {
  return await prisma.owner.findMany();
}

export async function addOwners(owner: Owner[]) {
  const response = await prisma.owner.createMany({
    data: owner,
  });

  console.log(response);

  return response;
}

export async function deleteOwners(ids: number[]) {
  const response = await prisma.owner.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  console.log(response);

  return response;
}
