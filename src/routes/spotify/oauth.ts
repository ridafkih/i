import { route, validation as v } from "18h";
import { spotifyApi } from "../../utils/spotify";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../../singletons/prisma";

export default route<{ code: string }>({
  get: {
    schema: {
      request: v.null(),
      response: v.null(),
    },
    async handler(context) {      
      const { code } = context.query as Record<string, string>;
      const { body: auth } = await spotifyApi.authorizationCodeGrant(code);

      const { access_token, expires_in, refresh_token } = auth;

      spotifyApi.setAccessToken(access_token);
      const me = await spotifyApi.getMe().catch(() => void 0);
      
      if (me?.body.id !== process.env.SPOTIFY_USER_ID) {
        return { status: 302, headers: { location: "/" } };
      } else {
        await prisma.spotifyKey.create({
          data: {
            refresh_token,
            access_token,
            code,
            expiresIn: new Date(expires_in)
          }
        })
      }

      return { status: 302, headers: { location: "/" } };
    },
  },
});
