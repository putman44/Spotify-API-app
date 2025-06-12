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
  getPlaylistTracks,
} from "./utils/spofityApi";
import {
  spotifyAuth,
  getTokenFromCode,
  getAccessToken,
} from "./utils/spotifyAuth";
import { PlaylistList } from "./components/PlaylistList";
import { CreateNewPlaylist } from "./components/CreateNewPlaylist";
import { Modal } from "./utils/Modal";

// Main App component for the Spotify Playlist app
function App() {
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  // State to manage the playlist name input
  const [playlistName, setPlaylistName] = useState("");
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State for search results from Spotify
  const [searchResults, setSearchResults] = useState([]);
  // State for the user's playlist (array of tracks)
  const [playlist, setPlaylist] = useState([]);
  // State for the Spotify access token
  const [token, setToken] = useState(null);
  // State for the list of user playlists
  const [playlistList, setPlaylistList] = useState([]);

  // On app load, check if code is present in URL and get token if needed
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    const existingToken = getAccessToken();

    if (existingToken) {
      setToken(existingToken);
      setLoading(false);
      return;
    }

    if (code) {
      getTokenFromCode().then(() => {
        const newToken = getAccessToken();
        if (newToken) {
          setToken(newToken);
          window.history.replaceState({}, document.title, "/");
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return; // Wait for token check to complete

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
  }, [loading]); // Depend on `loading`

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
      setModalMessage("You must be logged in with Spotify first.");
      setShowModal(true);
      return;
    }

    try {
      // Step 1: Get current user's Spotify ID
      const user = await getCurrentUser(accessToken);

      // Step 2: Check for existing playlist with the same name
      const existingPlaylist = playlistList.find(
        (playlist) =>
          playlist.name.trim().toLowerCase() ===
          playlistName.trim().toLowerCase()
      );
      const newTrackUris = playlist.map((track) => track.uri);

      if (existingPlaylist) {
        // Fetch tracks from the existing playlist
        const existingTracks = await getPlaylistTracks(
          existingPlaylist.id,
          accessToken
        );
        const existingTrackUris = existingTracks.map((track) => track.uri);

        // Use Set for O(1) lookup
        const newTrackSet = new Set(newTrackUris);
        const existingTrackSet = new Set(existingTrackUris);
        const allTracksSame =
          newTrackSet.size === existingTrackSet.size &&
          [...newTrackSet].every((uri) => existingTrackSet.has(uri));

        if (allTracksSame) {
          setModalMessage(
            "A playlist with this name and tracks already exists in your Spotify account."
          );
          setShowModal(true);
          return;
        } else {
          // Find new tracks to add (those not already in the playlist)
          const tracksToAdd = newTrackUris.filter(
            (uri) => !existingTrackSet.has(uri)
          );
          if (tracksToAdd.length > 0) {
            await addTracksToPlaylist(
              existingPlaylist.id,
              tracksToAdd,
              accessToken
            );
            setModalMessage("Playlist updated with new tracks!");
            setShowModal(true);
          } else {
            setModalMessage("No new tracks to add to the existing playlist.");
            setShowModal(true);
          }
          return;
        }
      }

      // Step 3: Create the playlist if it doesn't exist
      const newPlaylist = await createPlaylist(
        user.id,
        playlistName,
        accessToken
      );
      await addTracksToPlaylist(newPlaylist.id, newTrackUris, accessToken);
      setModalMessage("Playlist saved to Spotify!");
      setShowModal(true);
    } catch (err) {
      console.error("Failed to save playlist:", err);
      setModalMessage("Failed to save playlist. Check console for details.");
      setShowModal(true);
    }
  };

  const handlePlaylistClick = async (playlistId) => {
    const selectedPlaylist = playlistList.find(
      (playlist) => playlist.id === playlistId
    );
    setPlaylistName(selectedPlaylist.name);
    const tracks = await getPlaylistTracks(selectedPlaylist.id, token);

    setPlaylist(
      tracks.map((item) => ({
        id: item.id,
        name: item.name,
        artist: item.artists,
        album: item.album,
        uri: item.uri,
      }))
    );
  };

  return (
    <>
      {showModal && (
        <Modal setShowModal={setShowModal} modalMessage={modalMessage} />
      )}
      <div className="App">
        <h1>Create Your Spotify Playlist</h1>
        {!token && !loading ? (
          <button onClick={spotifyAuth}>Log in with Spotify</button>
        ) : (
          <>
            {/* ...the rest of your app as before... */}
            <SearchBar handleSearch={handleSearch} />
            {loading ? (
              <div>loading...</div>
            ) : (
              <PlaylistList
                handlePlaylistClick={handlePlaylistClick}
                playlistList={playlistList}
              />
            )}
            <CreateNewPlaylist
              setPlaylistName={setPlaylistName}
              setPlaylist={setPlaylist}
            />
            <main>
              <SearchResults
                handleAddToPlaylist={handleAddToPlaylist}
                filteredResults={searchResults}
              />
              <Playlist
                handlePlaylistName={(name) => setPlaylistName(name)}
                playlistName={playlistName}
                handleSavePlaylist={handleSavePlaylist}
                removeTrackFromPlaylist={removeTrackFromPlaylist}
                playlist={playlist}
              />
            </main>
          </>
        )}
      </div>
    </>
  );
}

export default App;
