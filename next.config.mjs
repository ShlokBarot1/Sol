/** @type {import('next').NextConfig} */
const nextConfig = {
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
    optimizePackageImports: ['lucide-react', 'gsap', 'd3', 'swiper', 'motion', '@supabase/supabase-js', 'shaders'],
    // Inline critical CSS into the HTML <head> so the stylesheet request no longer
    // blocks initial render (removes the render-blocking ~10 KiB CSS chunk).
    inlineCss: true,
  },
}

export default nextConfig
