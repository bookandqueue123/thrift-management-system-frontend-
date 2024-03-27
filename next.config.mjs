/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  env: {
    BACKEND_API: isProd
      ? "https://prod-api.finkia.com.ng/"
      : "http://localhost:5000/",
  },
};

export default nextConfig;
