import { route, validation as v } from "18h";
import { hash } from "argon2";

import { addAccessToken, enableAccessToken } from "../../actions/access-token";
import { ensureAdministrator } from "../../middleware/auth";
import { logRequest } from "../../middleware/log";
import { deconstructAccessToken } from "../../utils/access-token";

export default route({
  post: {
    schema: {
      request: v.object({
        accessToken: v.string(),
      }),
      response: v.unknown(),
    },
    middleware: { pre: [logRequest, ensureAdministrator] },
    async handler(context) {
      const { id } = deconstructAccessToken(context.request.body.accessToken);
      const { count } = await enableAccessToken(id);

      if (count > 0) return { body: void 0 };
      else return { status: 404, body: void 0 };
    },
    accepts: ["json"],
  },
});
