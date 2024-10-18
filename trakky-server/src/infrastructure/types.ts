import { Type } from "@prisma/client";
import prisma from "./client";

export async function get() {
  return await prisma.type.findMany();
}

export async function post(type: Type[]) {
  const response = await prisma.type.createMany({
    data: type,
  });

  console.log(response);

  return response;
}

export async function del(ids: number[]) {
  const response = await prisma.type.deleteMany({
    where: {
      id: { in: ids },
    },
  });

  console.log(response);

  return response;
}
