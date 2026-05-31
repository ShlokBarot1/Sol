/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap', 'd3', 'swiper', 'motion', '@supabase/supabase-js'],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      const existingCacheGroups = config.optimization.splitChunks?.cacheGroups || {}
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        maxInitialRequests: 30,
        cacheGroups: {
          ...existingCacheGroups,
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: 'vendor-gsap',
            chunks: 'async',
            priority: 40,
          },
          d3: {
            test: /[\\/]node_modules[\\/](d3|d3-[^/]+|internmap|robust-predicates|delaunator)[\\/]/,
            name: 'vendor-d3',
            chunks: 'async',
            priority: 38,
          },
          swiper: {
            test: /[\\/]node_modules[\\/]swiper[\\/]/,
            name: 'vendor-swiper',
            chunks: 'async',
            priority: 38,
          },
          motion: {
            test: /[\\/]node_modules[\\/]motion[\\/]/,
            name: 'vendor-motion',
            chunks: 'async',
            priority: 36,
          },
        },
      }
    }
    return config
  },
}

export default nextConfig
