/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@db:5432/urlshortener',
  },
}

module.exports = nextConfig