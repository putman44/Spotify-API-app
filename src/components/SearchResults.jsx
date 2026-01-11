import styles from "./SearchResults.module.css";
import { ArrowUp } from "lucide-react";

export default function SearchResults({
  handleAddToPlaylist,
  filteredResults,
  handlePlayTrack,
}) {
  return (
    <div className={styles.searchResults}>
      <h2 id="topSearchResults">Search Results</h2>

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
              <div className={styles.trackButtons}>
                <button onClick={() => handlePlayTrack(track.id)}>▶︎</button>
                <button
                  onClick={() => {
                    handleAddToPlaylist(track.id);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
      {filteredResults.length > 0 && (
        <a href="#topSearchResults" className={styles.bounceArrow}>
          <ArrowUp size={20} />
        </a>
      )}
    </div>
  );
}
