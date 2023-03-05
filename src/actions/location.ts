import { prisma } from "../singletons/prisma"

export const addLocation = async (url: string, city: string, region: string, longitude: number, latitude: number) => {
  const { id } = await prisma.location.create({ data: { url, city, region, longitude, latitude } });
  return { id };
}

/**
 * @param delay The time to delay in milliseconds.
 */
export const getLastLocation = async (delay: number) => {
  const { longitude, latitude, createdAt } = await prisma.location.findFirst({
    orderBy: { createdAt: "desc" },
    select: { longitude: true, latitude: true, createdAt: true },
    where: { createdAt: { lte: new Date(Date.now() - delay).toISOString() } }
  });

  return { longitude, latitude, date: createdAt };
};
