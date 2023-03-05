import { route, validation as v } from "18h";
import { addLocation } from "../actions/location";
import { ensureAuthenticated } from "../middleware/auth";

import { logRequest } from "../middleware/log";

export default route({
  post: {
    schema: {
      request: v.object({
        location: v.string().url().startsWith("https://maps.apple.com")
      }),
      response: v.object({
        id: v.string(),
      }),
    },
    middleware: { pre: [logRequest, ensureAuthenticated] },
    async handler(context) {
      const { location: url } = context.request.body;
      const { id } = await addLocation(url);
      
      return { body: { id } };
    },
    accepts: ["json"],
  },
});
