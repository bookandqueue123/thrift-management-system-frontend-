/** @type {import('next').NextConfig} */

const isProd = process.env.GIT_BRANCH === 'main';
const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  env: {
    BACKEND_API: isProd ? 'https://prod-api.finkia.com.ng/' : 'https://staging-api.finkia.com.ng/',
  },
};

export default nextConfig;
