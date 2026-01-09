import styles from "./SpotifyPlayer.module.css";

function SpotifyPlayer({ type = "track", spotifyId }) {
  if (!spotifyId) return null;

  return (
    <iframe
      src={`https://open.spotify.com/embed/${type}/${spotifyId}`}
      width="100%"
      height={type === "track" ? "80" : "380"}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      style={{ borderRadius: "12px" }}
    />
  );
}

export default SpotifyPlayer;
