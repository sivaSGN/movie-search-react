// ============================================
// src/App.jsx  (Favorites feature version)
//
// New concepts added in this version:
// - "user" and "token" state: who's logged in, and their auth token
// - localStorage: keeps the user logged in even after refreshing the page
//   (this is fine here — this is a real deployed app, not a sandboxed demo)
// - "favoriteIDs": a simple array of imdbIDs, used to quickly check
//   whether a given movie is already saved (shows filled vs empty heart)
// ============================================

import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import MovieGrid from "./components/MovieGrid";
import MovieModal from "./components/MovieModal";
import AuthForm from "./components/AuthForm";

const API_BASE_URL = "http://localhost:5000/api";

function App() {
  // ----- Movie search state (same as Step 5) -----
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultInfo, setResultInfo] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  // ----- Auth state -----
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authMode, setAuthMode] = useState(null); // null = form closed, "login" or "register" = open
  const [authError, setAuthError] = useState("");

  // ----- Favorites state -----
  const [favorites, setFavorites] = useState([]); // full favorite documents
  const favoriteIDs = favorites.map((fav) => fav.imdbID);
  const [view, setView] = useState("search"); // "search" or "favorites"

  // ----- On first load, restore login from localStorage if present -----
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    searchMovies("Avengers");
  }, []);

  // ----- Whenever we become logged in, fetch that user's favorites -----
  useEffect(() => {
    if (token) {
      fetchFavorites(token);
    } else {
      setFavorites([]); // logged out — clear the list
    }
  }, [token]);

  // ----- Movie search (same as before) -----
  const searchMovies = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setMovies([]);
    setResultInfo("");

    try {
      const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No movies found. Try a different search.");
      } else {
        setMovies(data.Search);
        setResultInfo(`Showing ${data.Search.length} of ${data.totalResults} results for "${searchTerm}"`);
      }
    } catch (err) {
      console.error(err);
      setError("Could not reach the server. Is your backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  };

  const openMovieDetails = async (imdbID) => {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${imdbID}`);
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Could not load movie details.");
        return;
      }
      setSelectedMovie(data);
    } catch (err) {
      console.error(err);
      alert("Could not reach the server.");
    }
  };

  // ----- AUTH: register -----
  const handleRegister = async (name, email, password) => {
    setAuthError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || "Registration failed");
        return;
      }

      completeLogin(data.token, data.user);
    } catch (err) {
      console.error(err);
      setAuthError("Could not reach the server");
    }
  };

  // ----- AUTH: login -----
  const handleLogin = async (email, password) => {
    setAuthError("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAuthError(data.error || "Login failed");
        return;
      }

      completeLogin(data.token, data.user);
    } catch (err) {
      console.error(err);
      setAuthError("Could not reach the server");
    }
  };

  // Shared helper: save token + user to state AND localStorage
  const completeLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setAuthMode(null); // close the form
    setAuthError("");
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setView("search");
  };

  // ----- FAVORITES: fetch the logged-in user's list -----
  const fetchFavorites = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();
      if (response.ok) {
        setFavorites(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ----- FAVORITES: add or remove, depending on current state -----
  const handleToggleFavorite = async (movie) => {
    if (!token) {
      setAuthMode("login"); // not logged in — prompt them to log in first
      return;
    }

    const alreadyFavorited = favoriteIDs.includes(movie.imdbID);

    if (alreadyFavorited) {
      // Remove
      try {
        await fetch(`${API_BASE_URL}/favorites/${movie.imdbID}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites((prev) => prev.filter((fav) => fav.imdbID !== movie.imdbID));
      } catch (err) {
        console.error(err);
      }
    } else {
      // Add
      try {
        const response = await fetch(`${API_BASE_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imdbID: movie.imdbID,
            title: movie.Title,
            poster: movie.Poster,
            year: movie.Year,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setFavorites((prev) => [data, ...prev]);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRemoveFavorite = async (imdbID) => {
    try {
      await fetch(`${API_BASE_URL}/favorites/${imdbID}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites((prev) => prev.filter((fav) => fav.imdbID !== imdbID));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <div className="top-bar">
            {user ? (
              <div className="user-bar">
                <span>Hi, {user.name}</span>
                <button className="link-btn" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            ) : (
              <button className="link-btn" onClick={() => setAuthMode("login")}>
                Log in / Sign up
              </button>
            )}
          </div>

          <h1 className="logo">
            CINE<span>FIND</span>
          </h1>
          <p className="tagline">Search any movie. Instantly.</p>

          <SearchBar query={query} setQuery={setQuery} onSearch={() => searchMovies(query)} />

          <div className="quick-tags">
            {["Marvel", "Batman", "Harry Potter", "Star Wars"].map((tag) => (
              <button
                key={tag}
                className="tag-btn"
                onClick={() => {
                  setQuery(tag);
                  searchMovies(tag);
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {user && (
            <div className="view-tabs">
              <button className={view === "search" ? "active" : ""} onClick={() => setView("search")}>
                Search
              </button>
              <button className={view === "favorites" ? "active" : ""} onClick={() => setView("favorites")}>
                My Favorites ({favorites.length})
              </button>
            </div>
          )}
        </div>
      </header>

      <main>
        {view === "search" ? (
          <>
            <div className="status-bar">
              <p>{resultInfo}</p>
            </div>

            {loading && (
              <div className="loader">
                <div className="spinner"></div>
                <p>Fetching movies...</p>
              </div>
            )}

            {error && (
              <div className="error-box">
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && (
              <MovieGrid
                movies={movies}
                onSelectMovie={openMovieDetails}
                favoriteIDs={favoriteIDs}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
          </>
        ) : (
          <>
            <div className="status-bar">
              <p>Your saved movies</p>
            </div>
            {favorites.length === 0 ? (
              <p className="empty-favorites">You haven't saved any movies yet — click the ♡ on any movie to add it.</p>
            ) : (
              <section className="movie-grid">
                {favorites.map((fav) => (
                  <div className="movie-card" key={fav.imdbID} onClick={() => openMovieDetails(fav.imdbID)}>
                    <button
                      className="heart-btn favorited"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(fav.imdbID);
                      }}
                      title="Remove from favorites"
                    >
                      ♥
                    </button>
                    <img src={fav.poster || "https://placehold.co/300x445/1f1f28/9a9aa3?text=No+Poster"} alt={fav.title} />
                    <div className="movie-card-info">
                      <h3>{fav.title}</h3>
                      <p>{fav.year}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          isFavorited={favoriteIDs.includes(selectedMovie.imdbID)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {authMode && (
        <AuthForm
          mode={authMode}
          setMode={setAuthMode}
          onLogin={handleLogin}
          onRegister={handleRegister}
          authError={authError}
          onClose={() => {
            setAuthMode(null);
            setAuthError("");
          }}
        />
      )}

      <footer>
        <p>Built with React &amp; Vite · Powered by your own Express backend</p>
      </footer>
    </>
  );
}

export default App;