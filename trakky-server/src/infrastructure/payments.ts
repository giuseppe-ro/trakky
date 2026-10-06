import { Prisma } from "@prisma/client";
import { logger } from "../logger";
import prisma from "./client";

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

  logger.info("updating:", payment)
  const response = await prisma.payment.update({
    where: { id },
    data,
  });

  logger.info(`Updated payment: ${JSON.stringify(payment)}`);

  return response;
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
