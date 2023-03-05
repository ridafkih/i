import { route, validation as v } from "18h";

import { logRequest } from "../../middleware/log";

export default route({
  post: {
    schema: {
      request: v.object({ location: v.string() }),
      response: v.undefined()
    },
    accepts: ["json"],
    middleware: { pre: [logRequest] },
    async handler(context) {
      return { body: void 0 };
    },
  }
})