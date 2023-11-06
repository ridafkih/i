import { route, validation as v } from "18h";
import { getLocationHistory } from "../actions/location";
import { ensureAuthenticated } from "../middleware/auth";

import { logRequest } from "../middleware/log";

export default route<{ limit?: string, cursor?: string }>({
  get: {
    schema: {
      request: v.null(),
      response: v.object({
        locations: v.array(
          v.object({
            id: v.string(),
            city: v.string(),
            region: v.string(),
            longitude: v.number(),
            latitude: v.number(),
            createdAt: v.number(),
          })
        ),
        limit: v.number(),
        cursor: v.string().optional(),
      }).or(v.null()).or(v.undefined()),
    },
    middleware: { pre: [logRequest, ensureAuthenticated] },
    async handler(context) {
      const limit = parseInt(context.URL.searchParams.get("limit")!) || 100;
      const cursor = context.URL.searchParams.get("cursor") ?? undefined;
  
      if (isNaN(limit) || limit < 0) return { status: 400 }
  
      const locations = (await getLocationHistory(cursor, limit)).map(({ createdAt, ...location }) => {
        return { ...location, createdAt: createdAt.getTime() };
      });

      return { body: { locations, limit, cursor } }
    }
  },
});