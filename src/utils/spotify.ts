import SpotifyWebApi from "spotify-web-api-node";

export interface SpotifyListeningData {
  name?: string;
  image?: {
    height?: number;
    width?: number;
    url?: string;
  };
  link?: string;
  artists?: string;
  isPlaying: boolean;
}


interface SpotifyItem {
  item: {
    name: string;
    album: {
      id: string;
    };
  };
}

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URL,
});

export const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-currently-playing",
  "user-read-playback-state",
];

/**
 * Gets the Spotify listening data for the user with the provided OAuth
 * token set as the SPOTIFY_OAUTH_TOKEN variable
 * @returns
 */
export const getSpotifyListeningData = async (
  accessToken: string
): Promise<SpotifyListeningData> => {
  spotifyApi.setAccessToken(accessToken);
  const { body: data } = await spotifyApi.getMyCurrentPlayingTrack({});

  const { item } = data as unknown as SpotifyItem;
  const { name } = item || {};

  if (!name) return { isPlaying: false };

  const { body: album } = await spotifyApi.getAlbum(item?.album.id);
  
  const { is_playing: isPlaying } = data;
  const {
    artists,
    external_urls: { spotify: link },
    images,
  } = album;

  const [image] = images;
  
  return {
    name,
    image,
    link,
    artists: artists.map(({ name }: { name: string }) => name).join(", "),
    isPlaying,
  };
};

/**
 * Refreshes the access token.
 * @param refreshToken The refresh token.
 * @returns The spotify access token data.
 */
export const refreshSpotifyAccessToken = async (refreshToken: string) => {
  spotifyApi.setRefreshToken(refreshToken);
  return spotifyApi.refreshAccessToken().then(({ body }) => body);
};
