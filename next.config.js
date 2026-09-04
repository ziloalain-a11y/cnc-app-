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
      {
        protocol: "https",
        hostname: "www.corbeaunews-centrafrique.org",
      },
      {
        protocol: "https",
        hostname: "pub-60c91a8283464ff6bb67f86d052ab093.r2.dev",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};
module.exports = nextConfig;
