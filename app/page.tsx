// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import "./styles/Home.css";
import { ArrowIcon } from "./Icons/icons";

/**
 * Creates a single floating particle and appends it to the container.
 */
const createParticle = (container: Element) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const particle = document.createElement("div");
  particle.classList.add("particle");

  const size = Math.random() * 10 + 5;
  const posX = Math.random() * 100;
  const posY = Math.random() * 100 + 100;
  const opacity = Math.random() * 0.5 + 0.1;
  const duration = Math.random() * 20 + 10;
  const delay = Math.random() * -20;

  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.left = `${posX}%`;
  particle.style.top = `${posY}%`;
  particle.style.opacity = `${opacity}`;
  particle.style.animationDuration = `${duration}s`;
  particle.style.animationDelay = `${delay}s`;

  container.appendChild(particle);
};

export default function Home() {
  const particlesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      createParticle(container);
    }
  }, []);

  return (
    <div className="home-container">
      {/* Floating particles background */}
      <div className="particles" ref={particlesRef}></div>

      <div className="hero-section">
        <h1>Discover Your Next Favorite Movie</h1>
        <p>
          Explore thousands of films, curate your personal collection, and find
          hidden gems tailored to your taste.
        </p>
        <Link
          href="/movies"
          className="cta-button"
          aria-label="Start exploring movies"
        >
          Start Exploring
          <ArrowIcon />
        </Link>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h3>Popular Movies</h3>
          <p>
            Discover what's trending worldwide with our real-time popularity
            rankings and curated editor's picks.
          </p>
        </div>
        <div className="feature-card">
          <h3>Your Favorites</h3>
          <p>
            Save movies to your personal watchlist and get recommendations based
            on your preferences.
          </p>
        </div>
        <div className="feature-card">
          <h3>Advanced Search</h3>
          <p>
            Filter by genre, year, rating, and more to find exactly what you're
            in the mood for.
          </p>
        </div>
      </div>
    </div>
  );
}
