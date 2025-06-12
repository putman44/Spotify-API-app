import styles from "./PlaylistList.module.css";

export const PlaylistList = ({ playlistList, handlePlaylistClick }) => {
  return (
    <div className={styles.playlistListContainer}>
      {playlistList.map((item) => (
        <div
          onClick={() => handlePlaylistClick(item.id)}
          className={styles.playlistCard}
          key={item.id}
        >
          {item.images && item.images.length > 0 && (
            <img src={item.images[0].url} alt={item.name} />
          )}
          <h3>{item.name}</h3>
        </div>
      ))}
    </div>
  );
};
