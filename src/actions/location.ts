import { prisma } from "../singletons/prisma"

export const addLocation = async (url: string) => {
  const { id } = await prisma.location.create({ data: { url } });
  return { id };
}