"use client";

import { useEffect, useMemo, useState } from "react";
import { Movie, useSearchStore } from "../store/SearchContext";
import { useFavoriteStore } from "../store/favoriteContext";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "../components/Card Modules/Card";
import { SearchIcon, FilmReelIcon, BinocularsIcon } from "../Icons/icons";
import Link from "next/link";
import "../styles/Movie.css";

export default function Movies() {
  const {
    query,
    setQuery,
    movies,
    isLoading,
    searched,
    searchMovies,
  } = useSearchStore();

  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [sortValue, setSortValue] = useState("release_date.desc");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) searchMovies();
    }, 3000);
    return () => clearTimeout(timer);
  }, [query]);

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      if (sortValue === "release_date.desc") {
        return (
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
        );
      } else if (sortValue === "vote_average.desc") {
        return b.vote_average - a.vote_average;
      }
      return 0;
    });
  }, [movies, sortValue]);

  // 🎬 Animation variants
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

  const handleFavoriteToggle = (movie: Movie) => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <div className="cinema-container">
      {/* 🔍 Search Header */}
      <div className="search-header">
        <motion.h1
          className="cinema-title"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          NoonTime Watch
        </motion.h1>

        <motion.div
          className="search-box"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <input
            aria-label="Search for movies"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            className="search-input"
          />
          <button
            onClick={searchMovies}
            className="search-button"
            aria-label="Execute movie search"
          >
            <SearchIcon />
          </button>
        </motion.div>
      </div>

      {/* 🎥 Content Area */}
      <div className="content-container">
        {!searched ? (
          <motion.div
            className="hero-empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="empty-illustration">
              <FilmReelIcon />
            </div>
            <h2>Discover Your Next Favorite Movie</h2>
          </motion.div>
        ) : isLoading ? (
          <motion.div
            className="loading-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="pulse-loader">
              <div className="pulse-dot"></div>
              <div className="pulse-dot"></div>
              <div className="pulse-dot"></div>
            </div>
            <p>Searching the cinematic universe...</p>
          </motion.div>
        ) : sortedMovies.length === 0 ? (
          <motion.div
            className="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="no-results-icon">
              <BinocularsIcon />
            </div>
            <h3>No movies found for "{query}"</h3>
            <p>Try different keywords or browse trending movies</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="results-header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2>Results for "{query}"</h2>
              <div className="sort-filter">
                <label htmlFor="sort" className="visually-hidden">
                  Sort movies by
                </label>
                <select
                  id="sort"
                  aria-label="Sort movies"
                  className="sort-select"
                  value={sortValue}
                  onChange={(e) => setSortValue(e.target.value)}
                >
                  <option value="release_date.desc">Release Date</option>
                  <option value="vote_average.desc">Rating</option>
                </select>
              </div>
            </motion.div>

            <motion.div
              className="movies-grid"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {sortedMovies.map((movie) => (
                  <motion.div
                    key={movie.id}
                    className="movie-card"
                    variants={item}
                    layout
                    whileHover={{ y: -10, zIndex: 10 }}
                    onHoverStart={() => setIsHovered(movie.id)}
                    onHoverEnd={() => setIsHovered(null)}
                  >
                    <Link
                      href={`/movie/${movie.id}`}
                      className="movie-card-link"
                      onClick={(e) => {
                        if (
                          (e.target as HTMLElement).closest(".action-button")
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <Card
                        movie={movie}
                        isHovered={isHovered}
                        onFavoriteToggle={() => handleFavoriteToggle(movie)}
                        isFavorite={isFavorite(movie.id)}
                      />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
