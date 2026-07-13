// ============================================
// src/components/SearchBar.jsx
// A "controlled input" — its value always comes from React state (query),
// and every keystroke updates that state via setQuery. This is the main
// mental shift from vanilla JS: the input doesn't hold its own value,
// React does.
// ============================================

function SearchBar({ query, setQuery, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault(); // stop the page from reloading
    onSearch();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Try 'Inception', 'Titanic', 'Batman'..."
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBar;