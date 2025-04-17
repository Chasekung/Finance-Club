/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/Finance-Club',
  assetPrefix: '/Finance-Club/',
  trailingSlash: true,
  distDir: 'out',
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Disable server-dependent features
  experimental: {
    webpackBuildWorker: true,
  },
  // Ensure static paths are generated
  env: {
    NEXT_PUBLIC_BASE_PATH: '/Finance-Club',
  },
  // Skip API routes during static export
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Add rewrites for GitHub Pages
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },
  // Add redirects for GitHub Pages
  async redirects() {
    return [
      {
        source: '/',
        destination: '/Finance-Club',
        permanent: true,
      },
    ];
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