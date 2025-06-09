import { useState } from "react";

import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";

const DATA = [
  { id: 1, name: "Song 1", artist: "Artist 1", album: "Album 1" },
  { id: 2, name: "Song 2", artist: "jame 2", album: "jame 2" },
  { id: 3, name: "Song 3", artist: "spitfire 3", album: "spitfire 3" },
];

function App() {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (term) => {
    const filtered = DATA.filter(
      (item) =>
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.artist.toLowerCase().includes(term.toLowerCase()) ||
        item.album.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
  };

  console.log("Search Results:", searchResults);

  return (
    <div className="App">
      <SearchBar handleSearch={handleSearch} />
      <SearchResults results={searchResults} />
    </div>
  );
}

export default App;
