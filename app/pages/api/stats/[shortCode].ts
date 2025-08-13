import { NextApiRequest, NextApiResponse } from 'next';
import { getPool, initializeDatabase } from '../../../lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await initializeDatabase();
    
    const { shortCode } = req.query;

    if (!shortCode || typeof shortCode !== 'string') {
      return res.status(400).json({ error: 'Short code is required' });
    }

    const pool = getPool();
    const result = await pool.query(
      'SELECT * FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    const urlData = result.rows[0];
    
    return res.status(200).json({
      shortCode: urlData.short_code,
      originalUrl: urlData.original_url,
      createdAt: urlData.created_at,
      clickCount: urlData.click_count
    });

  } catch (error) {
    console.error('Error getting URL stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}