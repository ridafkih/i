import { route, validation as v } from "18h";
import { ensureAuthenticated } from "../middleware/auth";

import { logRequest } from "../middleware/log";

export default route({
  post: {
    schema: {
      request: v.object({ location: v.string() }),
      response: v.undefined()
    },
    middleware: { pre: [logRequest, ensureAuthenticated] },
    async handler() {
      return { body: void 0 };
    },
    accepts: ["json"],
  },
});
