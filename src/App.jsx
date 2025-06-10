import { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import { searchSpotify } from "./utils/spofityApi";
import { spotifyAuth, getTokenFromCode } from "./utils/spotifyAuth";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [token, setToken] = useState(null);

  // On app load, check if code present and get token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !token) {
      getTokenFromCode().then(() => {
        const accessToken = localStorage.getItem("access_token");
        setToken(accessToken);
        // Clean the URL so code param disappears
        window.history.replaceState({}, document.title, "/");
      });
    } else {
      const accessToken = localStorage.getItem("access_token");
      if (accessToken) {
        setToken(accessToken);
      }
    }
  }, [token]);

  const handleSearch = async (term) => {
    if (!token) {
      // No token, start login flow
      spotifyAuth();
      return;
    }

    const results = await searchSpotify(term, token);
    setSearchResults(results);
    console.log("Search results:", results);
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
