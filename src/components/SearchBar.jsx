import "./SearchBar.css";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search by name or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
}

export default SearchBar;