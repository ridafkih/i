import { route, validation } from "18h";
import { scopes, spotifyApi } from "../../utils/spotify";

export default route({
  get: {
    schema: {
      request: validation.null(),
      response: validation.null(),
    },
    async handler() {
      const location = spotifyApi.createAuthorizeURL(scopes, "nil");
      return { status: 302, headers: { location } };
    }
  },
});
