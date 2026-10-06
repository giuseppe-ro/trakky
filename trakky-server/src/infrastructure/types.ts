import { Prisma } from "@prisma/client";
import prisma from "./client";

export async function get() {
  return await prisma.type.findMany();
}

export async function post(types: Omit<Prisma.TypeCreateManyInput, "id">[]) {
  const response = await prisma.type.createMany({
    data: types,
  });


  return response;
}

export async function del(ids: number[]) {
  const response = await prisma.type.deleteMany({
    where: {
      id: { in: ids },
    },
  });


  return response;
}
