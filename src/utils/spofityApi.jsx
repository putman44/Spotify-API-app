// Get the current user's Spotify profile using the access token
export const getCurrentUser = async (accessToken) => {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const data = await response.json();
  return data;
};

export const getUserPlaylists = async (userId, accessToken) => {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user playlists");
  }

  const data = await response.json();
  return data; // Return the list of playlists
};

// Create a new playlist for the user
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
        public: false, // Set to false for private playlist
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create playlist");
  }
  const data = await response.json();
  return data;
};

// Search Spotify for tracks matching the search term
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

  // Map the API response to a simplified track object
  return data.tracks.items.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artists[0].name,
    album: track.album.name,
    uri: track.uri,
  }));
}

// Add tracks to a playlist by playlist ID and array of track URIs
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

// Get tracks from a specific playlist by playlist ID
export const getPlaylistTracks = async (playlistId, accessToken) => {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlist tracks");
  }

  const data = await response.json();
  return data.items.map((item) => ({
    id: item.track.id,
    name: item.track.name,
    artist: item.track.artists[0].name,
    album: item.track.album.name,
    uri: item.track.uri,
  }));
};
