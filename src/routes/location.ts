import { route, validation as v } from "18h";
import { addLocation, getLastLocation } from "../actions/location";
import { ensureAuthenticated } from "../middleware/auth";
import jwa from "jwa";

import { logRequest } from "../middleware/log";

const { sign } = jwa("ES256");

const LOCATION_TIME_DELAY = 0; // 1000 * 60 * 60 * 60 * 24;
const {
  MAPKIT_PRIVATE_KEY,
  MAPKIT_TEAM_ID,
  MAPKIT_KEY_ID
} = process.env;


const getSignedMapSnapshotUrl = (params: string) => {
  const snapshotPath = `/api/v1/snapshot?${params}`;
  const completePath = `${snapshotPath}&teamId=${MAPKIT_TEAM_ID}&keyId=${MAPKIT_KEY_ID}`;
  const signature = sign(completePath, MAPKIT_PRIVATE_KEY!);
  return `https://snapshot.apple-mapkit.com${completePath}&signature=${signature}`;
}

export default route<{ delay?: string }>({
  get: {
    schema: {
      request: v.unknown(),
      response: v.object({
        description: v.string(),
        longitude: v.number(),
        latitude: v.number(),
        date: v.number(),
        snapshot: v.string(),
      }),
    },
    middleware: { pre: [logRequest] },
    async handler() {
      const { longitude, latitude, city, region, date } = await getLastLocation(LOCATION_TIME_DELAY);
      const description = `${city}, ${region}`;

      const parameters = new URLSearchParams();
      parameters.append("center", `${latitude},${longitude}`);
      parameters.append("size", "640x640");
      parameters.append("scale", "3");
      parameters.append("t", "mutedStandard");
      parameters.append("colorScheme", "dark");
      parameters.append("poi", "0");
      parameters.append("z", "10");

      const snapshot = getSignedMapSnapshotUrl(parameters.toString());

      return {
        body: { description, longitude, latitude, snapshot, date: date?.getTime() },
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
