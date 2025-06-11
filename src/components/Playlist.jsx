import { useState } from "react";
import styles from "./Playlist.module.css"; // Assuming you have a CSS module for styles

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
    <div className={styles.playlistContainer}>
      <input
        className={styles.playlistName}
        required
        value={playlistName}
        onChange={handlePlaylistName}
        type="text"
        placeholder="Playlist Name"
      />

      {playlist.length > 0 ? (
        <div>
          <ul className={styles.playlistItems}>
            {playlist.map((track) => (
              <div className={styles.playlistItem} key={track.id}>
                <li>
                  <p>
                    <strong>{track.name}</strong>
                  </p>
                  <p>
                    {track.artist} | {track.album}
                  </p>
                </li>
                <button
                  onClick={() => {
                    removeTrackFromPlaylist(track.id);
                  }}
                >
                  -
                </button>
              </div>
            ))}
          </ul>
          <button
            disabled={!playlistName}
            onClick={() => handleSavePlaylist(playlistName)}
          >
            {playlistName === "" ? "Enter a Playlist Name" : "Save to Spotify"}
          </button>
        </div>
      ) : (
        <p style={{ margin: 0 }}>Your playlist is empty</p>
      )}
    </div>
  );
}
