// Type definitions
export interface Movie {
  id: number;
  title: string;
  overview: string;
  genres: { id: number; name: string }[];
  poster_path: string | null;
  backdrop_path: string | null;
  runtime: number;
  vote_average: number;
  release_date: string;
  tagline: string;
}

export interface Credits {
  crew: {
    job: string;
    name: string;
    profile_path: string | null;
  }[];
  cast: Actor[];
}

export interface Actor {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  key: string;
  type: string;
  official: boolean;
}
/**
 * Zustand store interface for managing movie search state.
 */
export interface SearchState {
  query: string;
  movies: Movie[];
  isLoading: boolean;
  searched: boolean;
  setQuery: (query: string) => void;
  searchMovies: () => Promise<void>;
  loadPopularMovies: () => Promise<void>;
}