/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: "http://backend:3000/:path*",
      },
    ];
  },
};

export default nextConfig;
