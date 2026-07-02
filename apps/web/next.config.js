/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co"
      }
    ]
  },
  async rewrites() {
    return [{ source: "/san-pham/:slug.html", destination: "/san-pham/:slug" }];
  }
};

module.exports = nextConfig;
