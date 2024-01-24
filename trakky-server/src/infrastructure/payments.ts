import { Payment, PrismaClient } from "@prisma/client";
import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

  console.log("Updating:", payment)

  const response = await prisma.payment.update({
    where: { id: payment.id },
    data: payment,
  });

  console.log(response);

  return response;
}

export async function deletePayments(paymentIds: number[]) {
  const response = await prisma.payment.deleteMany({
    where: {
      id: { in: paymentIds },
    },
  });

  console.log(response);

  return response;
}
