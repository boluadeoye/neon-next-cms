/** @type {import('next').NextConfig} */

// Detect Termux-ish env to avoid native FS watchers and SWC minify crashes
const isTermux = !!(process.env.PREFIX && process.env.PREFIX.includes('/com.termux'));

const nextConfig = {
  // SWC minifier (WASM) can crash on Android; let Next fall back to Terser
  swcMinify: isTermux ? false : true,

  // Keep Node runtime consistent (avoid edge quirks)
  experimental: {
    // no special transforms
  },

  webpack: (config, { dev }) => {
    if (dev) {
      // Polling avoids EACCES errors from native watchers on Android
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/.git/**', '**/node_modules/**', '**/.next/**'],
      };
      config.infrastructureLogging = { level: 'error' };
    }
    return config;
  },
};

export default nextConfig;
