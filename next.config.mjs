/** @type {import('next').NextConfig} */

// const isProd = process.env.NODE_ENV === "production";

const apiEnv = process.env.NEXT_PUBLIC_API_ENV || "development";


const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  env: {
    BACKEND_API:
      apiEnv === "production"
        ? "https://prod-api.finkia.com.ng/"
        : "https://staging-api.finkia.com.ng/",
  },
};

export default nextConfig;
