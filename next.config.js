/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Finance-Club',
  assetPrefix: '/Finance-Club/',
  trailingSlash: true,
  distDir: 'out',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable server-dependent features
  experimental: {
    appDir: true,
    serverActions: false,
  },
  // Ensure static paths are generated
  env: {
    NEXT_PUBLIC_BASE_PATH: '/Finance-Club',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        http: false,
        https: false,
        os: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 