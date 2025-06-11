import styles from "./SearchResults.module.css";

export default function SearchResults({
  handleAddToPlaylist,
  filteredResults,
}) {
  return (
    <div className={styles.searchResults}>
      <h2>Search Results</h2>
      {filteredResults.length > 0 ? (
        <ul className={styles.resultsList}>
          {filteredResults.map((track) => (
            <div key={track.id} className={styles.track}>
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
                  handleAddToPlaylist(track.id);
                }}
              >
                +
              </button>
            </div>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
