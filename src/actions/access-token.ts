import { prisma } from "../singletons/prisma"

/**
 * @returns The database ID field for the access token.
 */
export const addAccessToken = async (hash: string): Promise<{ id: string }> => {
  const { id } = await prisma.accessToken.create({
    data: { argon2: hash },
  });

  return { id };
};

export const getAccessToken = async (id: string, enabled = true) => {
  return prisma.accessToken.findFirst({
    where: { id, enabled }
  });
};
