// ============================================
// src/components/MovieModal.jsx  (updated for Favorites)
// Same heart button pattern as MovieCard, just placed in the details view.
// ============================================

const PLACEHOLDER_POSTER = "https://placehold.co/300x445/1f1f28/9a9aa3?text=No+Poster";

function MovieModal({ movie, onClose, isFavorited, onToggleFavorite }) {
  const poster = movie.Poster !== "N/A" ? movie.Poster : PLACEHOLDER_POSTER;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content">
          <img src={poster} alt={`${movie.Title} poster`} />
          <div className="modal-details">
            <span className="rating-badge">⭐ {movie.imdbRating}</span>
            <h2>
              {movie.Title} ({movie.Year})
            </h2>
            <p>
              <strong>Genre:</strong> {movie.Genre}
            </p>
            <p>
              <strong>Director:</strong> {movie.Director}
            </p>
            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>
            <p>
              <strong>Runtime:</strong> {movie.Runtime}
            </p>
            <p>{movie.Plot}</p>

            <button
              className={`favorite-toggle-btn ${isFavorited ? "favorited" : ""}`}
              onClick={() =>
                onToggleFavorite({
                  imdbID: movie.imdbID,
                  Title: movie.Title,
                  Year: movie.Year,
                  Poster: movie.Poster,
                })
              }
            >
              {isFavorited ? "♥ Saved to Favorites" : "♡ Save to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;