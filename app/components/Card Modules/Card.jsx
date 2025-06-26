"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import {
  FilmIcon,
  PlayIcon,
  HeartIcon,
  HeartFilledIcon,
} from "../../Icons/icons";
import "../../styles/Card.css";

export function Card({ movie, isHovered, onFavoriteToggle, isFavorite }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const [showNoTrailer, setShowNoTrailer] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Fetch trailer only when card is in view
  useEffect(() => {
    if (!isInView) return;

    async function fetchTrailer() {
      try {
        setIsLoadingTrailer(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/${movie.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const data = await res.json();
        const trailer = data.results[0];
        setTrailerKey(trailer?.key || null);
      } catch (err) {
        console.error("Failed to fetch trailer:", err);
        setTrailerKey(null);
      } finally {
        setIsLoadingTrailer(false);
      }
    }

    fetchTrailer();
  }, [movie.id, isInView]);

  const handlePlayTrailer = (e) => {
    e.preventDefault();
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    } else {
      toast.error("Trailer not available.");
    }
  };

  return (
    <div className="poster-container" ref={cardRef}>
      {isInView ? (
        <>
          <div className="poster-wrapper">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
                loading="lazy"
              />
            ) : (
              <div className="poster-placeholder">
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
            >
              {movie.vote_average?.toFixed(1) ?? "N/A"}
            </div>
          </div>

          <AnimatePresence>
            {isHovered === movie.id && (
              <motion.div
                className="card-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="overlay-content">
                  <h3 className="movie-card-title">{movie.title}</h3>
                  <p className="movie-year">
                    {movie.release_date?.split("-")[0] || "N/A"}
                  </p>
                  <div className="action-buttons">
                    <button
                      className="action-button"
                      onClick={handlePlayTrailer}
                    >
                      <PlayIcon />
                      <span>Trailer</span>
                    </button>
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.preventDefault();
                        onFavoriteToggle(movie);
                      }}
                    >
                      {isFavorite ? (
                        <>
                          <HeartFilledIcon />
                          <span>Unfavorite</span>
                        </>
                      ) : (
                        <>
                          <HeartIcon />
                          <span>Favorite</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <div className="poster-placeholder">
          <FilmIcon />
        </div>
      )}
    </div>
  );
}
