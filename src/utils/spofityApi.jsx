export const getCurrentUser = async (accessToken) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  return response.json();
};

export const createPlaylist = async (userId, playlistName, accessToken) => {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: playlistName,
        description: "Created with Spotify API",
        public: false,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create playlist");
  }
  const data = await response.json();
  return data;
};

export async function searchSpotify(term, accessToken) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      term
    )}&type=track`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();

  if (!data.tracks) return [];

  return data.tracks.items.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    uri: track.uri,
  }));
}

export const addTracksToPlaylist = async (playlistId, uris, accessToken) => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uris }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to add tracks");
  }

  return response.json();
};
