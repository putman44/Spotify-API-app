import { useState } from "react";

import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";

const DATA = [
  { id: 1, name: "Song 1", artist: "Artist 1", album: "Album 1" },
  { id: 2, name: "Song 2", artist: "jame 2", album: "jame 2" },
  { id: 3, name: "Song 3", artist: "spitfire 3", album: "spitfire 3" },
];

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const handleSearch = (term) => {
    const filtered = DATA.filter(
      (item) =>
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.artist.toLowerCase().includes(term.toLowerCase()) ||
        item.album.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleAddToPlaylist = (trackId) => {
    const track = searchResults.find((item) => item.id === trackId);
    if (track && !playlist.some((item) => item.id === trackId)) {
      setPlaylist([...playlist, track]);
    }
  };

  const removeTrackFromPlaylist = (trackId) => {
    setPlaylist(playlist.filter((item) => item.id !== trackId));
  };

  return (
    <div className="App">
      <SearchBar handleSearch={handleSearch} />
      <main>
        <SearchResults
          handleAddToPlaylist={handleAddToPlaylist}
          filteredResults={searchResults}
        />
        <Playlist
          removeTrackFromPlaylist={removeTrackFromPlaylist}
          playlist={playlist}
        />
      </main>
    </div>
  );
}

export default App;
