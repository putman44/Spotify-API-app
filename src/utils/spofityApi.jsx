// utils/spofityApi.js

export async function searchSpotify(term, accessToken) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      term
    )}&type=track&limit=10`,
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
  }));
}
