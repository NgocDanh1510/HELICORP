/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  },
  async rewrites() {
    return [{ source: "/san-pham/:slug.html", destination: "/san-pham/:slug" }];
  },
  output: 'standalone'
};

module.exports = nextConfig;
