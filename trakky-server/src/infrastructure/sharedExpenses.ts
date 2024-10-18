import { Prisma, SharedExpenses } from "@prisma/client";
import { logger } from "../logger";
import prisma from "./client";

export async function get() {
  const response = await prisma.sharedExpenses.findMany();

  return response;
}

export async function add(shared: SharedExpenses[]) {

  return  await prisma.sharedExpenses.createMany({
    data: shared,
  });
}

export async function put(shared: SharedExpenses) {

  try {
    const aa = prisma.sharedExpenses;
    const response = await prisma.sharedExpenses.update({
      where: { Id: shared.Id },
      data: shared,
    });

    logger.info(`Updated Shared: ${JSON.stringify(shared)}`);

    return response;
  } catch (e) {
    logger.error(e);
  }

  return null;
}

export async function del(sharedIds: number[]) {
  const response = await prisma.sharedExpenses.deleteMany({
    where: {
      Id: { in: sharedIds },
    },
  });

  logger.info(`Deleted Shared ids: ${JSON.stringify(sharedIds)}`);

  return response;
}
