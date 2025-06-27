"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import Link from "next/link";
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
    e.stopPropagation();
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, "_blank");
    } else {
      toast.error("Trailer not available.");
    }
  };
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle(movie);
  };

 return (
    <div className="poster-container" ref={cardRef}>
      {isInView ? (
        <>
          <Link 
            href={`/movie/${movie.id}`} 
            className="poster-link"
            onClick={(e) => {
              if (
                e.target &&
                typeof e.target.closest === "function" &&
                e.target.closest(".action-button")
              ) {
                e.preventDefault();
              }
            }}
          >
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
          </Link>

          <AnimatePresence>
            {isHovered === movie.id && (
              <div className="card-overlay">
                <motion.div
                  className="overlay-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
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
                      onClick={handleFavoriteClick}
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
                </motion.div>
              </div>
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
