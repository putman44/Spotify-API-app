import { useState } from "react";

export default function Playlist({
  removeTrackFromPlaylist,
  playlist,
  handleSavePlaylist,
}) {
  const [playlistName, setPlaylistName] = useState("");

  const handlePlaylistName = (event) => {
    setPlaylistName(event.target.value);
  };

  return (
    <div className="playlist">
      <input
        required
        value={playlistName}
        onChange={handlePlaylistName}
        type="text"
        placeholder="Playlist Name"
      ></input>
      {playlist.length > 0 ? (
        <div>
          <ul>
            {playlist.map((track) => (
              <li key={track.id}>
                <strong>{track.name}</strong> by {track.artist} ({track.album})
                <button
                  onClick={() => {
                    removeTrackFromPlaylist(track.id);
                  }}
                >
                  -
                </button>
              </li>
            ))}
          </ul>
          <button
            disabled={!playlistName}
            onClick={() => handleSavePlaylist(playlistName)}
          >
            Save to Spotify
          </button>
        </div>
      ) : (
        <p>Your playlist is empty</p>
      )}
    </div>
  );
}
