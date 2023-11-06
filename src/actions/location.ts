import { Location } from "@prisma/client";
import { prisma } from "../singletons/prisma";

interface LocationInput {
  id: string;
  city: string;
  region: string;
  longitude: number;
  latitude: number;
  createdAt: Date;
}

export const addLocation = async (
  url: string,
  city: string,
  region: string,
  longitude: number,
  latitude: number
) => {
  const { id } = await prisma.location.create({
    data: { url, city, region, longitude, latitude },
  });
  return { id };
};

/**
 * @param delay The time to delay in milliseconds.
 */
export const getLastLocation = async (delay: number) => {
  const { city, region, longitude, latitude, createdAt } =
    (await prisma.location.findFirst({
      orderBy: { createdAt: "desc" },
      select: {
        city: true,
        region: true,
        longitude: true,
        latitude: true,
        createdAt: true,
      },
      where: { createdAt: { lte: new Date(Date.now() - delay).toISOString() } },
    })) ?? {};

  return { city, region, longitude, latitude, date: createdAt };
};

export const getLastLocations = (cursor: string | undefined, limit: number) => {
  return prisma.location.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      city: true,
      region: true,
      longitude: true,
      latitude: true,
      createdAt: true,
    },
    where: cursor ? { id: { lt: cursor } } : {},
    take: limit,
  });
};

export const getLocationHistory = async (
  cursor: string | undefined,
  limit: number
) => {
  const locations: LocationInput[] = [];
  
  let reference = await prisma.location.findFirst({
    where: cursor ? { id: { lte: cursor } } : {},
  });

  if (!reference) throw Error("Could not find reference location");
  locations.push(reference);

  for (let i = 0; i < limit; i++) {
    const location = await prisma.location.findFirst({
      where: {
        id: { lt: reference.id },
        city: { not: { equals: reference.city } },
        region: { not: { equals: reference.region } },
      },
      select: {
        id: true,
        city: true,
        region: true,
        longitude: true,
        latitude: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!location) break;
    locations.push(location);
  }

  return locations;
};
