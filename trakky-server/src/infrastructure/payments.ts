import { Prisma } from "@prisma/client";
import { logger } from "../logger";
import prisma from "./client";

// The id comes from the database, never from the request: creates exclude it and the
// update destructures it out of the data so it cannot end up in `data`.
type PaymentCreate = Omit<Prisma.PaymentCreateManyInput, "id">;
type PaymentUpdate = PaymentCreate & { id: number };

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

export async function post(payments: PaymentCreate[]) {

  return  await prisma.payment.createMany({
    data: payments,
  });
}

export async function put(payment: PaymentUpdate) {
  const { id, ...data } = payment;

  try {

    logger.info("updating:", payment)
    const response = await prisma.payment.update({
      where: { id },
      data,
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
