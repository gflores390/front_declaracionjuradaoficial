/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    qualities: [75, 90, 100], // agrega 100 aquí
  },
}

module.exports = nextConfig