/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/san-pham/:slug.html", destination: "/san-pham/:slug" }];
  }
};

module.exports = nextConfig;
