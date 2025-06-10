export default function SearchResults({
  handleAddToPlaylist,
  filteredResults,
}) {
  return (
    <div className="search-results">
      <h2>Search Results</h2>
      {filteredResults.length > 0 ? (
        <ul>
          {filteredResults.map((track) => (
            <li key={track.id}>
              <strong>{track.name}</strong> by {track.artist} ({track.album})
              <button
                onClick={() => {
                  handleAddToPlaylist(track.id);
                }}
              >
                +
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
