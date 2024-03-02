/** @type {import('next').NextConfig} */
const nextConfig = {
  eactStrictMode: true,
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true
  },
};

export default nextConfig;
