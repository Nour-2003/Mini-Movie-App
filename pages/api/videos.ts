// pages/api/videos.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing movie ID' });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'TMDB fetch failed' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('TMDB video fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
