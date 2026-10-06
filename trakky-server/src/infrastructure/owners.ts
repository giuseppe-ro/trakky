import { Prisma } from "@prisma/client";
import prisma from "./client";

export async function get() {
  return await prisma.owner.findMany();
}

export async function post(owners: Omit<Prisma.OwnerCreateManyInput, "id">[]) {
  const response = await prisma.owner.createMany({
    data: owners,
  });

  console.log(response);

  return response;
}

export async function del(ids: number[]) {
  const response = await prisma.owner.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  console.log(response);

  return response;
}
