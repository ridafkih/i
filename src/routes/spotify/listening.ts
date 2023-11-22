import { route, validation as v } from "18h";
import {
  getSpotifyListeningData,
  refreshSpotifyAccessToken,
} from "../../utils/spotify";
import { PrismaClient } from "@prisma/client";

const currentlyListeningResponse = v.union([
  v.object({
    name: v.string(),
    image: v.object({
      height: v.number(),
      width: v.number(),
      url: v.string(),
    }),
    isPlaying: v.boolean(),
    link: v.string(),
    artists: v.string(),
  }),
  v.object({
    isPlaying: v.boolean()
  })
])

const isTokenExpired = (expiresIn: Date, created_at: Date) =>
  new Date(created_at).getTime() + expiresIn.getTime() * 1000 <= new Date().getTime();

let currentlyListening: typeof currentlyListeningResponse._type = {
  isPlaying: false,
}

const updateCurrentlyListening = async () => {
  const client = new PrismaClient();
  const spotifyKey = await client.spotifyKey.findFirst();

  if (!spotifyKey) return;
  const { access_token, refresh_token, expiresIn, createdAt } = spotifyKey;

  if (isTokenExpired(expiresIn, createdAt)) {
    const { access_token, expires_in } = await refreshSpotifyAccessToken(refresh_token);
    await client.spotifyKey.update({
      where: {
        id: spotifyKey.id
      },
      data: {
        access_token,
        expiresIn: new Date(expires_in)
      }
    })
  }
  
  currentlyListening = await getSpotifyListeningData(access_token)
    .catch(() => ({ isPlaying: false }));
}

updateCurrentlyListening();
setInterval(updateCurrentlyListening, 10000);

export default route<{ code: string }>({
  get: {
    schema: {
      request: v.null(),
      response: currentlyListeningResponse,
    },
    async handler() {
      return { body: currentlyListening };
    },
  },
});
