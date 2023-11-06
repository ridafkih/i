import { route, validation as v } from "18h";
import { getLastLocations } from "../actions/location";
import { ensureAuthenticated } from "../middleware/auth";

import { logRequest } from "../middleware/log";

export default route<{ limit?: string, cursor?: string }>({
  get: {
    schema: {
      request: v.undefined(),
      response: v.object({
        locations: v.array(
          v.object({
            id: v.string(),
            url: v.string(),
            city: v.string(),
            region: v.string(),
            longitude: v.number(),
            latitude: v.number(),
            date: v.number(),
          })
        ),
        limit: v.number(),
        cursor: v.string().optional(),
      }).or(v.undefined()),
    },
    middleware: { pre: [logRequest, ensureAuthenticated] },
    async handler(context) {
      const limit = parseInt(context.params.limit!) || 100;
      const cursor = context.URL.searchParams.get("cursor") ?? undefined;
  
      if (isNaN(limit) || limit < 0) return { status: 400 }
  
      const locations = await getLastLocations(cursor, limit);
      return { body: { locations, limit, cursor } }
    }
  },
});