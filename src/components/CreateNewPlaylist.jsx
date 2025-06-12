export const CreateNewPlaylist = ({ setPlaylist, setPlaylistName }) => {
  return (
    <div style={{ marginBottom: "25px" }} className="create-new-playlist">
      <button
        onClick={() => {
          setPlaylist([]);
          setPlaylistName("");
        }}
      >
        Create New Playlist
      </button>
    </div>
  );
};
