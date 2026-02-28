/** @type {import('next').NextConfig} */

const isTermux = !!(process.env.PREFIX && process.env.PREFIX.includes('/com.termux'));

const nextConfig = {
  swcMinify: isTermux ? false : true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/.git/**', '**/node_modules/**', '**/.next/**'],
      };
    }
    return config;
  },
};

export default nextConfig;
