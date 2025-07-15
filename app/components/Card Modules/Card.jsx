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
  const [isMobile, setIsMobile] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef(null);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

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
        const res = await fetch(`/api/videos?id=${movie.id}`);
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

  const handleCardClick = (e) => {
    if (isMobile) {
      e.preventDefault();
      setShowActions(!showActions);
    }
  };

  const handleDetailsNavigation = () => {
    if (!isMobile || !isActive) {
      window.location.href = `/movie/${movie.id}`;
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
          <div className="poster-wrapper">
            {/* Changed to div wrapper with onClick for mobile */}
            <div
              className="poster-click-area"
              onClick={isMobile ? handleCardClick : undefined}
            >
              <Link
                href={`/movie/${movie.id}`}
                className="poster-link"
                onClick={(e) => isMobile && e.preventDefault()}
              >
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
              </Link>
            </div>

            <AnimatePresence>
              {(isHovered === movie.id || (isMobile && showActions)) && (
                <div className="card-overlay">
                  <motion.div
                    className="overlay-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
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
                      {isMobile && (
                        <Link
                          href={`/movie/${movie.id}`}
                          className="action-button details-button"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div className="poster-placeholder">
          <FilmIcon />
        </div>
      )}
    </div>
  );
}
