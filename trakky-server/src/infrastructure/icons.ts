import prisma from "./client";

export async function get() {
  return await prisma.icon.findMany();
}
