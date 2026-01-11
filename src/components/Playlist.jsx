import styles from "./Playlist.module.css";
import { ArrowUp } from "lucide-react";

export default function Playlist({
  removeTrackFromPlaylist,
  playlist,
  handleSavePlaylist,
  playlistName,
  handlePlaylistName,
  handlePlayTrack,
  handleClearPlaylist,
}) {
  return (
    <div className={styles.playlistContainer}>
      <div id="topPlaylist">
        <input
          className={styles.playlistName}
          required
          value={playlistName}
          onChange={(event) => handlePlaylistName(event.target.value)}
          type="text"
          placeholder="Playlist Name"
        />
      </div>

      {playlist.length > 0 ? (
        <div>
          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              disabled={!playlistName}
              onClick={() => handleSavePlaylist(playlistName)}
            >
              {playlistName === ""
                ? "Enter a Playlist Name"
                : "Save to Spotify"}
            </button>
            <button
              className={styles.button}
              onClick={() => handleClearPlaylist(playlist)}
            >
              Clear Playlist
            </button>
          </div>

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
                <div className={styles.trackButtons}>
                  <button onClick={() => handlePlayTrack(track.id)}>▶︎</button>

                  <button
                    onClick={() => {
                      removeTrackFromPlaylist(track.id);
                    }}
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ margin: 0 }}>Your playlist is empty</p>
      )}
      {playlist.length > 0 && (
        <a href="#topPlaylist" className={styles.bounceArrow}>
          <ArrowUp size={20} />
        </a>
      )}
    </div>
  );
}
