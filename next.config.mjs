/** @type {import('next').NextConfig} */

const isProd = process.env.NEXT_PUBLIC_APP_ENV === "production";
console.log(process.env.NEXT_PUBLIC_APP_ENV);

const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
  },
  env: {
    BACKEND_API: isProd
      ? "https://api-prod.finkia.com.ng/"
      : "https://api-test.finkia.com.ng/",
    PASSWORD_ENCRYPTION_KEY: process.env.PASSWORD_ENCRYPTION_KEY,
  },
};

export default nextConfig;
