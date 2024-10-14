/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "images.unsplash.com"
      },
      {
        hostname: "tailwindui.com"
      }
    ]
  },
  env: {
    URL_API: process.env.URL_API
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
