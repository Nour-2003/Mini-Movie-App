// app/movie/[id]/page.tsx
import "../../styles/MovieDetails.css";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  MovieIcon,
  DateIcon,
  TimeIcon,
  StarIcon,
  PlayIcon,
  SynopsisIcon,
  DirectorIcon,
  DirectorAvatarPlaceHolder,
  CastIcon,
  CastPlaceHolder,
} from "@/app/Icons/icons";
import { Movie, Credits, Video } from "../../store/interfaces";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movie = await fetchMovie(id);

  if (!movie) {
    return {
      title: "Movie Not Found | CineVerse",
      description: "The movie you're looking for doesn't exist.",
    };
  }

  return {
    title: `${movie.title} | CineVerse`,
    description: movie.overview || "Discover movie details",
    openGraph: {
      images: movie.backdrop_path
        ? [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`]
        : [],
    },
  };
}
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function fetchMovie(id: string): Promise<Movie | null> {
  const res = await fetch(`${baseUrl}/api/movie?id=${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchCredits(id: string): Promise<Credits | null> {
  const res = await fetch(`${baseUrl}/api/credits?id=${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchVideos(
  id: string
): Promise<{ results: Video[] } | null> {
  const res = await fetch(`${baseUrl}/api/videos?id=${id}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // First destructure params
  const { id } = await params;

  // Then fetch all data
  const [movie, credits, videos] = await Promise.all([
    fetchMovie(id),
    fetchCredits(id),
    fetchVideos(id),
  ]);

  if (!movie || !credits) return notFound();

  const {
    title,
    overview,
    genres,
    poster_path,
    backdrop_path,
    runtime,
    vote_average,
    release_date,
    tagline,
  } = movie;

  const director = credits.crew.find((person) => person.job === "Director");

  const topCast = credits.cast.slice(0, 8);
  const trailer = videos?.results?.find(
    (video) => video.type === "Trailer" && video.official
  );

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="movie-page">
      {/* Hero Section with Backdrop */}
      <div className="hero-details-section">
        {backdrop_path ? (
          <div className="backdrop-container">
            <Image
              src={`https://image.tmdb.org/t/p/w1280${backdrop_path}`}
              alt={title}
              fill
              className="backdrop-image"
              priority
            />
            <div className="backdrop-overlay" />
          </div>
        ) : (
          <div className="backdrop-fallback" />
        )}

        <div className="hero-content">
          <div className="poster-detail-container">
            {poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${poster_path}`}
                alt={title}
                width={500}
                height={750}
                className="movie-poster-detail"
                priority
              />
            ) : (
              <div
                className="poster-detail-placeholder"
                aria-label="No poster available"
              >
                <MovieIcon />
              </div>
            )}
          </div>

          <div className="movie-info">
            <div className="title-section">
              <h1 className="movie-detail-title">{title}</h1>
              {tagline && <p className="movie-tagline">{tagline}</p>}
            </div>

            <div className="meta-section">
              <div className="meta-item">
                <DateIcon />
                <span>{release_date?.split("-")[0]}</span>
              </div>

              <div className="meta-item">
                <TimeIcon />
                <span>{formatRuntime(runtime)}</span>
              </div>

              <div className="meta-item">
                <StarIcon />
                <span>{vote_average.toFixed(1)}/10</span>
              </div>
            </div>

            <div className="genres-section">
              {genres.map((genre) => (
                <span key={genre.id} className="genre-badge">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-grid">
          <div className="content-column">
            {/* Overview Section */}
            <section className="overview-section" aria-label="Movie Overview">
              <h2 className="section-title">
                <SynopsisIcon /> Synopsis
              </h2>
              <p className="overview-text">{overview}</p>
            </section>

            {/* Director Section */}
            {director && (
              <section className="director-section" aria-label="Movie Director">
                <h2 className="section-title">
                  <DirectorIcon /> Director
                </h2>
                <div className="director-card">
                  {director.profile_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
                      alt={director.name}
                      width={80}
                      height={80}
                      className="director-avatar"
                      loading="lazy"
                    />
                  ) : (
                    <div className="director-avatar placeholder">
                      <DirectorAvatarPlaceHolder />
                    </div>
                  )}
                  <div className="director-info">
                    <h3 className="director-name">{director.name}</h3>
                    <p className="director-role">Director</p>
                  </div>
                </div>
              </section>
            )}

            {/* Trailer Section */}
            {trailer ? (
              <section className="trailer-section" aria-label="Movie Trailer">
                <h2 className="section-title">
                  <PlayIcon /> Trailer
                </h2>
                <div className="trailer-container">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0`}
                    title={`${title} Official Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="trailer-iframe"
                  />
                </div>
              </section>
            ) : (
              <section
                className="trailer-section"
                aria-label="Trailer Not Available"
              >
                <h2 className="section-title">
                  <PlayIcon /> Trailer
                </h2>
                <div className="trailer-unavailable">
                  <p>No official trailer available</p>
                </div>
              </section>
            )}
          </div>

          <div className="content-column">
            {/* Cast Section */}
            <section className="cast-section" aria-label="Top Cast">
              <h2 className="section-title">
                <CastIcon /> Top Cast
              </h2>
              <div className="cast-grid">
                {topCast.map((actor) => (
                  <div key={actor.id} className="cast-card">
                    {actor.profile_path ? (
                      <Image
                        loading="lazy"
                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                        alt={actor.name}
                        width={150}
                        height={225}
                        className="cast-avatar"
                      />
                    ) : (
                      <div className="cast-avatar placeholder">
                        <CastPlaceHolder />
                      </div>
                    )}
                    <div className="cast-info">
                      <h3 className="cast-name">{actor.name}</h3>
                      <p className="cast-character">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
