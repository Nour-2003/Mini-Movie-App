// pages/api/credits.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Missing movie ID' });

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}`
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Credits API error", error);
    res.status(500).json({ error: 'Internal error' });
  }
}
