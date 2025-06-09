import { useState } from "react";

export default function SearchBar({ handleSearch }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(inputValue); // Call parent-provided handler
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          placeholder="Search for songs, artists, or albums..."
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
