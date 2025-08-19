/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize image loading to reduce aborted requests
  images: {
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['localhost','deepnex-fashionex.onrender.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'deepnex-fashionex.onrender.com',
        pathname: '/uploads/**',
      },
    ],
  },
  // Optimize static asset loading
   experimental: {
     optimizeCss: true,
     optimizeServerReact: true,
   },
   // Proxy configuration for production backend
   async rewrites() {
     return [
       {
         source: '/api/:path*',
         destination: 'https://deepnex-fashionex.onrender.com/api/:path*',
       },
     ];
   },
};


export default nextConfig;
