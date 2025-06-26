"use client";

import Image from "next/image";
import { useFavoriteStore } from "../store/favoriteContext";
import { motion, AnimatePresence } from "framer-motion";
import { HeartFilledIcon, FilmIcon } from "../Icons/icons";
import { Movie } from "../store/SearchContext";
import "../styles/Favorite.css";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoriteStore();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="favorites-page" aria-label="Favorites Page">
      {/* Header */}
      <motion.header
        className="favorites-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="cinema-title">Your Favorites</h1>
        <div
          className="favorites-count"
          aria-label={`${favorites.length} saved movies`}
        >
          <HeartFilledIcon size={24} />
          <span>{favorites.length} saved movies</span>
        </div>
      </motion.header>

      {/* Content */}
      <div className="content-container">
        {favorites.length === 0 ? (
          <motion.section
            className="empty-favorites"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            aria-label="No favorites yet"
          >
            <div className="empty-illustration">
              <HeartFilledIcon size={80} color="#ff3258" animated={false} />
            </div>
            <h2>Your heart is empty... for now</h2>
            <p>Start adding movies to your favorites collection</p>
            <motion.button
              className="browse-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = "/movies")}
              aria-label="Browse movies"
            >
              Browse Movies
            </motion.button>
          </motion.section>
        ) : (
          <motion.section
            className="movies-grid"
            variants={container}
            initial="hidden"
            animate="show"
            aria-label="Favorite Movies List"
          >
            <AnimatePresence>
              {favorites.map((movie: Movie) => (
                <motion.article
                  key={movie.id}
                  className="movie-card"
                  variants={item}
                  layout
                  whileHover={{ y: -10, zIndex: 10 }}
                  aria-label={`Favorite movie: ${movie.title}`}
                >
                  <div className="poster-container">
                    <div className="poster-wrapper">
                      {movie.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                          width={300}
                          height={450}
                          className="movie-poster"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="poster-placeholder"
                          aria-label="No poster available"
                        >
                          <FilmIcon />
                        </div>
                      )}

                      <div
                        className={`rating-badge ${
                          movie.vote_average > 7
                            ? "high-rating"
                            : movie.vote_average > 5
                            ? "medium-rating"
                            : "low-rating"
                        }`}
                        aria-label={`Rating: ${movie.vote_average.toFixed(
                          1
                        )} out of 10`}
                      >
                        {movie.vote_average.toFixed(1)}
                      </div>
                    </div>

                    <div className="card-overlay">
                      <div className="overlay-content">
                        <h3 className="movie-title">{movie.title}</h3>
                        <p className="movie-year">
                          {movie.release_date?.split("-")[0] || "N/A"}
                        </p>
                        <div className="action-buttons">
                          <button
                            className="action-button remove-button"
                            onClick={() => removeFavorite(movie.id)}
                            aria-label={`Remove ${movie.title} from favorites`}
                          >
                            <HeartFilledIcon size={18} />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.section>
        )}
      </div>
    </main>
  );
}
