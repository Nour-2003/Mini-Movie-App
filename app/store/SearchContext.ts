// stores/useSearchStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * Movie model used across the app.
 */
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

/**
 * Zustand store interface for managing movie search state.
 */
interface SearchState {
  query: string;
  movies: Movie[];
  isLoading: boolean;
  searched: boolean;
  setQuery: (query: string) => void;
  searchMovies: () => Promise<void>;
  loadPopularMovies: () => Promise<void>;
}

/**
 * Zustand store for handling search functionality.
 * Includes state for query, loading, search results, and popular movies.
 */
export const useSearchStore = create<SearchState>()(
  devtools(
    persist(
      (set, get) => ({
        query: "",
        movies: [],
        isLoading: false,
        searched: false,

        // Updates the search query
        setQuery: (query) => set({ query }, false, "setQuery"),

        // Fetches movies based on current query
        searchMovies: async () => {
          const { query } = get();
          if (!query) return;

          set({ isLoading: true, searched: true }, false, "searchMovies:start");

          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_TMDB_API_URL}/search/movie?api_key=${
                process.env.NEXT_PUBLIC_TMDB_API_KEY
              }&query=${encodeURIComponent(query)}`
            );
            const data = await response.json();
            set({ movies: data.results }, false, "searchMovies:success");
          } catch (error) {
            console.error("Search error:", error);
          } finally {
            set({ isLoading: false }, false, "searchMovies:end");
          }
        },

        // Loads popular movies (default fallback)
        loadPopularMovies: async () => {
          set({ isLoading: true }, false, "loadPopularMovies:start");

          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_TMDB_API_URL}/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
            );
            const data = await response.json();
            set(
              { movies: data.results, searched: false },
              false,
              "loadPopularMovies:success"
            );
          } catch (error) {
            console.error("Error loading popular movies:", error);
          } finally {
            set({ isLoading: false }, false, "loadPopularMovies:end");
          }
        },
      }),
      {
        name: "search-store", // LocalStorage key for persisting state
        partialize: (state) => ({ query: state.query }), // Persist only the query
      }
    )
  )
);
