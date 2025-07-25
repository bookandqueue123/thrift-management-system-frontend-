/** @type {import('next').NextConfig} */

const isProd = process.env.NEXT_PUBLIC_APP_ENV === "production";

const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
  },
  env: {
    BACKEND_API: isProd
      ? "https://thrift-management-system-staging.onrender.com/"
      : "https://thrift-management-system-staging.onrender.com/",
    PASSWORD_ENCRYPTION_KEY: process.env.PASSWORD_ENCRYPTION_KEY,
    PHOTOROOM_API_KEY: "0a5c58691fcc11c0e5d5ee16054feee4df9feff0",
  },
};

export default nextConfig;
