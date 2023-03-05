import { route, validation as v } from "18h";
import { addLocation, getLastLocation } from "../actions/location";
import { ensureAuthenticated } from "../middleware/auth";

import { logRequest } from "../middleware/log";

const LOCATION_TIME_DELAY = 0; // 1000 * 60 * 60 * 60 * 24;

export default route<{ delay?: string }>({
  get: {
    schema: {
      request: v.unknown(),
      response: v.object({
        description: v.string(),
        longitude: v.number(),
        latitude: v.number(),
        date: v.number(),
      }),
    },
    middleware: { pre: [logRequest] },
    async handler() {
      const { longitude, latitude, city, region, date } = await getLastLocation(LOCATION_TIME_DELAY);
      const description = `${city}, ${region}`;

      return {
        body: { description, longitude, latitude, date: date?.getTime() },
      };
    },
  },
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
    accepts: ["json"],
    async handler(context) {
      const { url, city, region, longitude, latitude } = context.request.body;
      const { id } = await addLocation(url, city, region, parseFloat(longitude), parseFloat(latitude));
      
      return { body: { id } };
    },
  },
});
