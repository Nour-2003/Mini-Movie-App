"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiSearch, FiMenu, FiX, FiHeart, FiHome, FiFilm } from "react-icons/fi";
import "../../styles/Navbar.css"; // Ensure you have this CSS file for styling
import { useSearchStore } from "../../store/SearchContext"; // Updated path

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { query, setQuery, searchMovies } = useSearchStore();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchMovies();
    setIsMobileMenuOpen(false); // Close mobile menu on search
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link href="/" className="logo" onClick={closeMobileMenu}>
            <span className="logo-icon">🎬</span>
            <span>NoonTime Watch</span>
          </Link>

          <ul className={`navLinks ${isMobileMenuOpen ? "active" : ""}`}>
            <li>
              <Link href="/" onClick={closeMobileMenu}>
                <FiHome className="nav-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/movies" onClick={closeMobileMenu}>
                <FiFilm className="nav-icon" />
                <span>Movies</span>
              </Link>
            </li>
            <li>
              <Link href="/favorites" onClick={closeMobileMenu}>
                <FiHeart className="nav-icon" />
                <span>Favorites</span>
              </Link>
            </li>
          </ul>
        </div>
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
