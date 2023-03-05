import { route, validation as v } from "18h";
import { hash } from "argon2";

import { addAccessToken } from "../../actions/access-token";
import { logRequest } from "../../middleware/log";
import { createAccessSecret, createAccessToken, stripUuid } from "../../utils/access-token";

export default route({
  post: {
    schema: {
      request: v.unknown(),
      response: v.object({
        accessToken: v.string(),
      }),
    },
    middleware: { pre: [logRequest] },
    async handler() {
      const token = createAccessSecret();
      const argon2 = await hash(token);

      const { id } = await addAccessToken(argon2);
      
      return {
        body: {
          accessToken: createAccessToken(id, token),
        },
      };
    },
    accepts: ["json"],
  },
});
