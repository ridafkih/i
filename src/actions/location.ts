import { prisma } from "../singletons/prisma"

export const addLocation = async (url: string, city: string, region: string) => {
  const { id } = await prisma.location.create({ data: { url, city, region } });
  return { id };
}