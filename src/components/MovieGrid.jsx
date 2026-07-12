// ============================================
// src/components/MovieGrid.jsx  (updated for Favorites)
// Just passes the new favorite-related props down to each MovieCard.
// ============================================

import MovieCard from "./MovieCard";

const PLACEHOLDER_POSTER = "https://placehold.co/300x445/1f1f28/9a9aa3?text=No+Poster";

function MovieGrid({ movies, onSelectMovie, favoriteIDs, onToggleFavorite }) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <section className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          poster={movie.Poster !== "N/A" ? movie.Poster : PLACEHOLDER_POSTER}
          onClick={() => onSelectMovie(movie.imdbID)}
          isFavorited={favoriteIDs.includes(movie.imdbID)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </section>
  );
}

export default MovieGrid;