import { useState } from "react";
import spaces from "../data/spaces.json";
import SpaceCard from "../components/SpaceCard";
import SearchBar from "../components/SearchBar";
import "./Home.css";

function Home() {
  const [search, setSearch] = useState("");

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(search.toLowerCase()) ||
    space.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">StudySpot PH</h1>
        <p className="hero-subtitle">
          Discover cozy co-working spaces across the Philippines
        </p>
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      <div className="spaces-section">
        <h2 className="section-title">Available Study Spaces</h2>
        {filteredSpaces.length === 0 ? (
          <div className="no-results">
            <p>No spaces found matching your search.</p>
            <p>Try different keywords or browse all spaces.</p>
          </div>
        ) : (
          <div className="spaces-grid">
            {filteredSpaces.map(space => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;