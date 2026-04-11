/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "corbeaunews-centrafrique.org",
      },
      {
        protocol: "http",
        hostname: "corbeaunews-centrafrique.org",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
