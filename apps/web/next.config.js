/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "res.cloudinary.com",
      "img.clerk.com",
      "api.dicebear.com",
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    return [
      {
        source: "/api/backend/:path*",
        destination: apiUrl + "/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
