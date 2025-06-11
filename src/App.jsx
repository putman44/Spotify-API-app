import { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Playlist from "./components/Playlist";
import {
  getCurrentUser,
  searchSpotify,
  createPlaylist,
  addTracksToPlaylist,
  getUserPlaylists,
} from "./utils/spofityApi";
import {
  spotifyAuth,
  getTokenFromCode,
  getAccessToken,
} from "./utils/spotifyAuth";
import { PlaylistList } from "./components/PlaylistList";

// Main App component for the Spotify Playlist app
function App() {
  // State for search results from Spotify
  const [searchResults, setSearchResults] = useState([]);
  // State for the user's playlist (array of tracks)
  const [playlist, setPlaylist] = useState([]);
  // State for the Spotify access token
  const [token, setToken] = useState(null);
  // State for the list of playlists
  const [playlistList, setPlaylistList] = useState([]);

  // On app load, check if code is present in URL and get token if needed
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !token) {
      // If redirected from Spotify with a code, exchange it for a token
      getTokenFromCode().then(() => {
        const accessToken = getAccessToken();
        if (accessToken) {
          setToken(accessToken);
          // Clean the URL so code param disappears
          window.history.replaceState({}, document.title, "/");
        }
      });
    } else {
      // If already authenticated, get token from localStorage
      const accessToken = getAccessToken();
      if (accessToken) {
        setToken(accessToken);
      }
    }
  }, [token]);

  // Handle search bar submission
  const handleSearch = async (term) => {
    if (!token || token === "null") {
      // No token, start login flow
      spotifyAuth();
      return;
    }
    // Search Spotify for tracks
    try {
      const results = await searchSpotify(term, token);
      const filteredResults = results.filter(
        (track) => !playlist.some((item) => item.id === track.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching Spotify:", error);
    }
  };

  // Add a track to the playlist by ID
  const handleAddToPlaylist = (trackId) => {
    const currentTrackId = searchResults.find((item) => item.id === trackId);
    setPlaylist((prevPlaylist) => {
      if (!prevPlaylist.some((track) => track.id === currentTrackId.id)) {
        return [...prevPlaylist, currentTrackId];
      }
      return prevPlaylist; // Avoid duplicates
    });
    setSearchResults((prevResults) =>
      prevResults.filter((track) => track.id !== currentTrackId.id)
    );
  };

  // Remove a track from the playlist by ID
  const removeTrackFromPlaylist = (trackId) => {
    setPlaylist(playlist.filter((item) => item.id !== trackId));
    // Add the removed track back to search results
    setSearchResults((prevResults) => {
      const removedTrack = playlist.find((track) => track.id === trackId);
      // If the track was found in the playlist, add it back to search results
      if (removedTrack) {
        // Ensure the track is added back to search results without duplicates
        return [...prevResults, removedTrack].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }
      return prevResults;
    });
  };

  // Save the playlist to the user's Spotify account
  const handleSavePlaylist = async (playlistName) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      alert("You must be logged in with Spotify first.");
      return;
    }

    try {
      // Step 1: Get current user's Spotify ID
      const user = await getCurrentUser(accessToken);
      // Step 2: Create the playlist
      const newPlaylist = await createPlaylist(
        user.id,
        playlistName,
        accessToken
      );
      // Step 3: Add tracks to the playlist
      const uris = playlist.map((track) => track.uri); // Make sure `track.uri` exists
      await addTracksToPlaylist(newPlaylist.id, uris, accessToken);
      alert("Playlist saved to Spotify!");
    } catch (err) {
      console.error("Failed to save playlist:", err);
      alert("Failed to save playlist. Check console for details.");
    }
  };

  useEffect(() => {
    const fetchUserPlaylists = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error("No access token found");
        return;
      }
      try {
        const user = await getCurrentUser(accessToken);
        const playlists = await getUserPlaylists(user.id, accessToken);
        setPlaylistList(playlists.items);
      } catch (error) {
        console.error("Error fetching user playlists:", error);
      }
    };
    fetchUserPlaylists();
  }, []);

  return (
    <div className="App">
      <h1>Create Your Spotify Playlist</h1>
      {/* Search bar for user input */}
      <SearchBar handleSearch={handleSearch} />
      {/* Display user's playlists if needed */}
      <PlaylistList playlistList={playlistList} />

      <main>
        {/* Search results list */}
        <SearchResults
          handleAddToPlaylist={handleAddToPlaylist}
          filteredResults={searchResults}
        />
        {/* Playlist display and save button */}
        <Playlist
          handleSavePlaylist={handleSavePlaylist}
          removeTrackFromPlaylist={removeTrackFromPlaylist}
          playlist={playlist}
        />
      </main>
    </div>
  );
}

export default App;
