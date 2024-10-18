import { Payment } from "@prisma/client";
import { logger } from "../logger";
import prisma from "./client";

export async function get() {
  const response = await prisma.payment.findMany({
    orderBy: [
      {
        date: 'desc',
      },
    ],
  });

  return response;
}

export async function post(payment: Payment[]) {

  return  await prisma.payment.createMany({
    data: payment,
  });
}

export async function put(payment: Payment) {

  try {

    logger.info("updating:", payment)
    const response = await prisma.payment.update({
      where: { id: payment.id },
      data: payment,
    });

    logger.info(`Updated payment: ${JSON.stringify(payment)}`);

    return response;
  } catch (e) {
    logger.error(e);
  }

  return null;
}

export async function del(paymentIds: number[]) {
  const response = await prisma.payment.deleteMany({
    where: {
      id: { in: paymentIds },
    },
  });

  logger.info(`Deleted payment ids: ${JSON.stringify(paymentIds)}`);

  return response;
}
