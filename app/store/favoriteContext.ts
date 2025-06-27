import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Movie } from "../store/interfaces";

type FavoriteStore = {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
};

export const useFavoriteStore = create<FavoriteStore>()(
  devtools(
    persist(
      (set, get) => ({
        favorites: [],

        addFavorite: (movie) => {
          const { favorites } = get();
          if (!favorites.find((m) => m.id === movie.id)) {
            set({ favorites: [...favorites, movie] }, false, "addFavorite");
          }
        },

        removeFavorite: (movieId) => {
          set(
            (state) => ({
              favorites: state.favorites.filter(
                (movie) => movie.id !== movieId
              ),
            }),
            false,
            "removeFavorite"
          );
        },

        isFavorite: (movieId) => {
          return get().favorites.some((movie) => movie.id === movieId);
        },
      }),
      {
        name: "favorite-movies",
        partialize: (state) => ({ favorites: state.favorites }),
      }
    )
  )
);
