// lib/api/movie.ts

import { Movie, Credits, Video } from "../../store/interfaces";

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
