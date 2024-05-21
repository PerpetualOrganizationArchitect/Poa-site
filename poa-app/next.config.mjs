/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'host', value: 'poa.on-fleek.app' }],
        destination: 'https://poa.community',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'poa.on-fleek.app' }],
        destination: 'https://poa.community/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
