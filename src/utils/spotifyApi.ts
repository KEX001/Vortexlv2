import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "/spotifyConfig";

// Function to get the access token from Spotify
const getAccessToken = async () => {
  const auth = `Basic ${Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64")}`;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: auth,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  const data = await response.json();
  return data.access_token;
};

// Function to fetch currently playing track details
const fetchCurrentTrack = async () => {
  const accessToken = await getAccessToken();

  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null; // In case no track is playing
  }

  const data = await response.json();
  return data;
};
