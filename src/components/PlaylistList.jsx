import styles from "./PlaylistList.module.css";

export const PlaylistList = ({ playlistList }) => {
  return (
    <div className={styles.playlistListContainer}>
      {playlistList.map((item) => (
        <div className={styles.playlistCard} key={item.id}>
          {/* Only show the playlist image and title */}
          {item.images && item.images.length > 0 && (
            <img src={item.images[0].url} alt={item.name} />
          )}
          <h3>{item.name}</h3>
        </div>
      ))}
    </div>
  );
};
