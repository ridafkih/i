import { route, validation as v } from "18h";
import { addLocation } from "../actions/location";
import { ensureAuthenticated } from "../middleware/auth";

import { logRequest } from "../middleware/log";

export default route({
  post: {
    schema: {
      request: v.object({
        url: v.string().url().startsWith("https://maps.apple.com"),
        city: v.string(),
        region: v.string(),
        longitude: v.string(),
        latitude: v.string(),
      }),
      response: v.object({
        id: v.string(),
      }),
    },
    middleware: { pre: [logRequest, ensureAuthenticated] },
    async handler(context) {
      const { url, city, region, longitude, latitude } = context.request.body;
      const { id } = await addLocation(url, city, region, parseFloat(longitude), parseFloat(latitude));
      
      return { body: { id } };
    },
    accepts: ["json"],
  },
});
