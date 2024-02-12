import { Payment, PrismaClient } from "@prisma/client";
import { logger } from "../logger";

const prisma = new PrismaClient();

export async function getPayments() {
  const response = await prisma.payment.findMany({
    orderBy: [
      {
        date: 'desc',
      },
    ],
  });

  return response;
}

export async function addPayments(payment: Payment[]) {

  return  await prisma.payment.createMany({
    data: payment,
  });
}

export async function updatePayment(payment: Payment) {

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

export async function deletePayments(paymentIds: number[]) {
  const response = await prisma.payment.deleteMany({
    where: {
      id: { in: paymentIds },
    },
  });

  logger.info(`Deleted payment ids: ${JSON.stringify(paymentIds)}`);

  return response;
}
