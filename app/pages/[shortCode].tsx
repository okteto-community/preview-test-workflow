import { GetServerSideProps } from 'next';
import { getPool, initializeDatabase } from '../lib/db';

export default function RedirectPage() {
  return (
    <div>Redirecting...</div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { shortCode } = context.params!;

  if (!shortCode || typeof shortCode !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    await initializeDatabase();
    
    const pool = getPool();
    
    // Get the original URL
    const result = await pool.query(
      'SELECT original_url FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return {
        notFound: true,
      };
    }

    const originalUrl = result.rows[0].original_url;

    // Increment click count
    await pool.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
      [shortCode]
    );

    return {
      redirect: {
        destination: originalUrl,
        permanent: false,
      },
    };

  } catch (error) {
    console.error('Error redirecting:', error);
    return {
      notFound: true,
    };
  }
};