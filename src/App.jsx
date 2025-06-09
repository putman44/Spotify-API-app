import { useState } from "react";

import "./App.css";
import SearchBar from "./components/SearchBar";

const DATA = [{ id: 1, name: "Song 1", artist: "Artist 1", album: "Album 1" }];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  console.log(searchTerm);
  return (
    <div className="App">
      <SearchBar setSearchTerm={setSearchTerm} />
    </div>
  );
}

export default App;
