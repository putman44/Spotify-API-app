# Spotify Playlist Manager

A web application to search, manage, and save Spotify playlists. Built with **React**, **JavaScript**, and **Spotify Web API**, this app allows users to create playlists, add tracks, and manage tracks efficiently.

---

## Features

- **Search Spotify Tracks:** Search songs by name, artist, or album.
- **Add/Remove Tracks:** Add tracks from search results to your custom playlist.
- **Play Tracks:** Preview tracks directly within the app.
- **Create Spotify Playlists:** Save playlists to your Spotify account.
- **Manage Existing Playlists:** Load and update your Spotify playlists.
- **User Authentication:** Login via Spotify OAuth2 to securely access your account.
- **Modal Feedback:** Get instant notifications for success, errors, or warnings.

---

## Tech Stack

- **Frontend:** React, CSS Modules
- **Backend:** Spotify Web API (OAuth2)
- **State Management:** React `useState` and `useEffect`
- **Utilities:** Custom hooks and helper functions for Spotify API calls
- **Deployment Ready:** Can be hosted on Vercel, Netlify, or similar platforms

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Spotify Developer Account (for Client ID & Secret)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/spotify-playlist-app.git
cd spotify-playlist-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:

```env
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id
REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000
```

4. Start the development server:

```bash
npm start
# or
yarn start
```

Your app should now be running at `http://localhost:3000`.

---

## Usage

1. Click **"Log in with Spotify"** to authenticate.
2. Use the **Search Bar** to find tracks.
3. Select one or multiple tracks (Shift+Click supported) and add them to your playlist.
4. Enter a playlist name and click **Save Playlist** to add it to your Spotify account.
5. Click on an existing playlist in **Playlist List** to view and update it.

---

## Folder Structure

```
/src
  /components
    SearchBar.js
    SearchResults.js
    Playlist.js
    PlaylistList.js
    CreateNewPlaylist.js
  /utils
    spotifyApi.js
    spotifyAuth.js
    Modal.js
  App.js
  App.css
```

- **components/** – React components for UI
- **utils/** – API utilities and helper functions
- **App.js** – Main React app
- **App.css** – Styling

---

## Key Functions

- `spotifyAuth()` – Initiates OAuth login with Spotify.
- `getAccessToken()` – Retrieves stored access token.
- `searchSpotify(term, token)` – Searches Spotify for tracks.
- `createPlaylist(userId, name, token)` – Creates a playlist for the user.
- `addTracksToPlaylist(playlistId, tracks, token)` – Adds tracks to a playlist.
- `getCurrentUser(token)` – Fetches the current logged-in Spotify user.

---

## Screenshots

**Search & Multi-Select:**

![Search & Multi-Select](src/assets/MechanicsAPI.png)

**Playlist Preview:**

![Playlist Preview](src/assets/PlaylistPreview.png)

---

---
