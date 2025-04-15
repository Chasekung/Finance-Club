/** @type {import('next').NextConfig} */
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/Finance-Club',
  assetPrefix: '/Finance-Club/',
  trailingSlash: true,
  distDir: 'out',
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true }
}; 