// stores/useSearchStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { SearchState,Movie} from "./interfaces";

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


        setQuery: (query) => set({ query }, false, "setQuery"),


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
        name: "search-store", 
        partialize: (state) => ({ query: state.query }), 
      }
    )
  )
);
