import { Payment, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPayments(paymentIds: number[]) {
  const response = await prisma.payment.findMany({
    where: {
      id: { in: paymentIds },
    },
  });

  return response;
}

export async function getAllPayments() {
  const response = await prisma.payment.findMany({
    orderBy: [
      {
        date: 'desc',
      },
    ],
  });

  return response;
}

export async function getPayment(paymentId: number) {
  const response = await prisma.payment.findFirst({ 
    orderBy: [
      {
        date: 'desc',
      },
    ],
    where: { 
      id: paymentId 
    } 
  });

  return response;
}

export async function addPayments(payment: Payment[]) {
  const response = await prisma.payment.createMany({
    data: payment,
  });

  console.log(response);

  return response;
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
