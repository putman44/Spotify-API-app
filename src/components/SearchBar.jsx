export default function SearchBar({ setSearchTerm }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Optionally do something with the searchTerm, e.g., trigger a search
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          onChange={() => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search for songs, artists, or albums..."
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
