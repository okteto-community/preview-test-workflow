import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import { getPool, initializeDatabase } from '../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await initializeDatabase();
    
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const pool = getPool();
    const shortCode = nanoid(8);

    // Insert the URL into the database
    const result = await pool.query(
      'INSERT INTO urls (original_url, short_code) VALUES ($1, $2) RETURNING *',
      [url, shortCode]
    );

    const baseUrl = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}`;
    const shortUrl = `${baseUrl}/${shortCode}`;

    return res.status(201).json({
      originalUrl: url,
      shortUrl,
      shortCode,
      createdAt: result.rows[0].created_at
    });

  } catch (error) {
    console.error('Error shortening URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}