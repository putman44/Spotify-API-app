import { useState } from "react";
import styles from "./SearchBar.module.css"; // Assuming you have a CSS module for styles

export default function SearchBar({ handleSearch }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch(inputValue); // Call parent-provided handler
  };

  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        className={styles.searchInput}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
        placeholder="Search for songs, artists, or albums..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
