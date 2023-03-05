import { prisma } from "../singletons/prisma"

export const addLocation = async (url: string, city: string, region: string, longitude: number, latitude: number) => {
  const { id } = await prisma.location.create({ data: { url, city, region, longitude, latitude } });
  return { id };
}