import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getIcons() {
  return await prisma.icon.findMany();
}
