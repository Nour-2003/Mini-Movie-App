"use client";

import Image from "next/image";
import Link from "next/link";
import { useFavoriteStore } from "../store/favoriteContext";
import { motion, AnimatePresence } from "framer-motion";
import { HeartFilledIcon, FilmIcon } from "../Icons/icons";
import { Movie } from "../store/interfaces";
import "../styles/Favorite.css";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavoriteStore();
  const [isMobile, setIsMobile] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

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

  const handleRemoveFavorite = (e: React.MouseEvent, movieId: number) => {
    e.stopPropagation();
    removeFavorite(movieId);
    setActiveCard(null);
  };

  const toggleCardActive = (movieId: number) => {
    if (!isMobile) return;
    setActiveCard(activeCard === movieId ? null : movieId);
  };

  return (
    <main className="favorites-page" aria-label="Favorites Page">
      {/* Header (keep existing header code) */}
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
            {/* Keep empty state content */}
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
                  whileHover={{ y: isMobile ? 0 : -10, zIndex: 10 }}
                  aria-label={`Favorite movie: ${movie.title}`}
                  onClick={() => toggleCardActive(movie.id)}
                >
                  <div className="poster-container">
                    <Link href={`/movie/${movie.id}`} className="poster-link">
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
                    </Link>

                    <div
                      className={`card-favorite-overlay ${
                        activeCard === movie.id ? "active" : ""
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="overlay-content">
                        <h3 className="movie-title">{movie.title}</h3>
                        <p className="movie-year">
                          {movie.release_date?.split("-")[0] || "N/A"}
                        </p>
                        <div className="action-buttons">
                          <button
                            className="action-button remove-button"
                            onClick={(e) => handleRemoveFavorite(e, movie.id)}
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
