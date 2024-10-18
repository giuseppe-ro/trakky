import { Owner } from "@prisma/client";
import prisma from "./client";

export async function get() {
  return await prisma.owner.findMany();
}

export async function post(owner: Owner[]) {
  const response = await prisma.owner.createMany({
    data: owner,
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
