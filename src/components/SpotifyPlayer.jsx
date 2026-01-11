import styles from "./SpotifyPlayer.module.css";

function SpotifyPlayer({ type = "track", spotifyId }) {
  return spotifyId ? (
    <iframe
      src={`https://open.spotify.com/embed/${type}/${spotifyId}`}
      width="100%"
      height={type === "track" ? "80" : "380"}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style={{ borderRadius: "12px" }}
    />
  ) : (
    <div className={styles.playerPlaceholder}>
      Select a track to start playing
    </div>
  );
}

export default SpotifyPlayer;
