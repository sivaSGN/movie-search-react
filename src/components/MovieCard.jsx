// ============================================
// src/components/MovieCard.jsx  (updated for Favorites)
// Added: a heart button. It doesn't decide the favorite logic itself —
// it just calls onToggleFavorite, which App.jsx owns, and displays
// whether isFavorited is true or false.
// ============================================

function MovieCard({ movie, poster, onClick, isFavorited, onToggleFavorite }) {
  const handleHeartClick = (e) => {
    e.stopPropagation(); // don't also trigger the card's onClick (which opens the modal)
    onToggleFavorite(movie);
  };

  return (
    <div className="movie-card" onClick={onClick}>
      <button
        className={`heart-btn ${isFavorited ? "favorited" : ""}`}
        onClick={handleHeartClick}
        title={isFavorited ? "Remove from favorites" : "Save to favorites"}
      >
        {isFavorited ? "♥" : "♡"}
      </button>
      <img src={poster} alt={`${movie.Title} poster`} />
      <div className="movie-card-info">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
      </div>
    </div>
  );
}

export default MovieCard;