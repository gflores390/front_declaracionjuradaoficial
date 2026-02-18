/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    qualities: [75, 90, 100], // agrega 100 aquí
  },
}

module.exports = nextConfig