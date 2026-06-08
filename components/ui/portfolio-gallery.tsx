"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

const PortfolioGalleryDesktop = dynamic(() => import('./portfolio-gallery-desktop').then(m => m.PortfolioGalleryDesktop), { ssr: false })

const _radiantRingD = Array.from({ length: 36 }, (_, i) => {
  const a = (i * 10) * Math.PI / 180;
  const r = (v: number) => +v.toFixed(4);
  return `M${r(50+27*Math.cos(a))},${r(50+27*Math.sin(a))} L${r(50+46*Math.cos(a))},${r(50+46*Math.sin(a))}`;
}).join(" ");

const _hLinesD = [
  [18,14,64],[8,21,84],[22,28,56],[4,35,92],
  [14,42,72],[8,49,84],[20,56,60],[4,63,92],
  [18,70,64],[10,77,80],
].map(([x,y,w]) => `M${x},${y+2} h${w}`).join(" ");

const SYMBOLS = [
  // 1: Radiant ring — precomputed path (was 36 <line> nodes)
  <svg key="1" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="1.4">
    <path d={_radiantRingD} />
  </svg>,
  // 2: Two quarter-circle wedges (pinwheel)
  <svg key="2" viewBox="0 0 100 100" fill="white">
    <path d="M50,50 L10,50 A40,40 0 0,1 50,10 Z" />
    <path d="M50,50 L90,50 A40,40 0 0,1 50,90 Z" />
  </svg>,
  // 3: 8-armed rectangular asterisk + corner bracket
  <svg key="3" viewBox="0 0 100 100" fill="white">
    <rect x="45" y="13" width="10" height="30" rx="2" />
    <rect x="45" y="57" width="10" height="30" rx="2" />
    <rect x="13" y="45" width="30" height="10" rx="2" />
    <rect x="57" y="45" width="30" height="10" rx="2" />
    <rect x="45" y="13" width="10" height="30" rx="2" transform="rotate(45 50 50)" />
    <rect x="45" y="57" width="10" height="30" rx="2" transform="rotate(45 50 50)" />
    <rect x="72" y="10" width="18" height="5" />
    <rect x="85" y="10" width="5" height="18" />
  </svg>,
  // 4: Three-pronged trident
  <svg key="4" viewBox="0 0 100 100" fill="white">
    <rect x="44" y="48" width="12" height="40" rx="6" />
    <rect x="44" y="14" width="12" height="32" rx="6" transform="rotate(-22 50 50)" />
    <rect x="44" y="14" width="12" height="32" rx="6" transform="rotate(22 50 50)" />
    <ellipse cx="50" cy="56" rx="12" ry="8" />
  </svg>,
  // 5: Grid of X and + shapes
  <svg key="5" viewBox="0 0 100 100" fill="white">
    <rect x="13" y="21" width="24" height="8" rx="2" transform="rotate(45 25 25)" />
    <rect x="13" y="21" width="24" height="8" rx="2" transform="rotate(-45 25 25)" />
    <rect x="63" y="21" width="24" height="8" rx="2" transform="rotate(45 75 25)" />
    <rect x="63" y="21" width="24" height="8" rx="2" transform="rotate(-45 75 25)" />
    <rect x="13" y="71" width="24" height="8" rx="2" transform="rotate(45 25 75)" />
    <rect x="13" y="71" width="24" height="8" rx="2" transform="rotate(-45 25 75)" />
    <rect x="63" y="71" width="24" height="8" rx="2" transform="rotate(45 75 75)" />
    <rect x="63" y="71" width="24" height="8" rx="2" transform="rotate(-45 75 75)" />
    <rect x="46" y="36" width="8" height="28" rx="2" />
    <rect x="36" y="46" width="28" height="8" rx="2" />
  </svg>,
  // 6: Horizontal lines (data/signal) — precomputed path (was 10 <rect> nodes)
  <svg key="6" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round">
    <path d={_hLinesD} />
  </svg>,
]

interface PortfolioGalleryProps {
  title?: string;
  archiveButton?: {
    text: string;
    href: string;
  };
  images?: Array<{
    src: string;
    alt: string;
    title?: string;
  }>;
  className?: string;
  maxHeight?: number;
  spacing?: string;
  onImageClick?: (index: number) => void;
  /**
   * Whether to pause marquee animation on hover (mobile only)
   * @default true
   */
  pauseOnHover?: boolean;
  /**
   * Number of times to repeat the content in marquee (mobile only)
   * @default 4
   */
  marqueeRepeat?: number;
}

export function PortfolioGallery({
  title = "Browse my library",
  archiveButton = {
    text: "View gallery",
    href: "/work"
  },
  images: customImages,
  className = "",
  maxHeight = 120,
  spacing = "-space-x-72 md:-space-x-[380px] lg:-space-x-[550px]",
  onImageClick,
  pauseOnHover = true,
  marqueeRepeat = 4
}: PortfolioGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768)
  }, [])
  
  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&q=80",
      alt: "SaaS Dashboard Design",
    },
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&q=80",
      alt: "Web Development",
    },
    {
      src: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop&q=80",
      alt: "E-Commerce Platform",
    },
    {
      src: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop&q=80",
      alt: "Mobile App Design",
    },
    {
      src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop&q=80",
      alt: "Brand Identity",
    },
    {
      src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop&q=80",
      alt: "Marketing Campaign",
    },
    {
      src: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=80",
      alt: "Product Photography",
    },
    {
      src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&h=600&fit=crop&q=80",
      alt: "Packaging Design",
    },
    {
      src: "https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=800&h=600&fit=crop&q=80",
      alt: "Tech Innovation",
    },
    {
      src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop&q=80",
      alt: "Future Vision",
    },
  ]
  
  const images = customImages || defaultImages

  return (
    <section
      aria-label={title}
      className={`relative min-h-screen py-20 px-4 ${className}`}
      id="archives"
    >
      <div
        className="relative max-w-7xl mx-auto overflow-hidden rounded-3xl"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.13)",
          boxShadow:
            "inset 0 1.5px 0 0 rgba(255,255,255,0.32), inset 0 -1px 0 0 rgba(0,0,0,0.06), inset 1px 0 0 0 rgba(255,255,255,0.08), inset -1px 0 0 0 rgba(255,255,255,0.08), 0 40px 80px -20px rgba(0,0,0,0.55), 0 0 120px -40px rgba(60,0,255,0.12)",
        }}
      >
        {/* Apple Liquid Glass: diagonal refraction lensing */}
        <div className="pointer-events-none absolute inset-0 z-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.02) 30%, transparent 55%)" }} />
        {/* Apple Liquid Glass: top specular shimmer */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[1.5px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 30%, rgba(255,255,255,0.72) 50%, rgba(255,255,255,0.55) 70%, transparent 100%)" }} />
        {/* Ambient orb */}
        <div className="pointer-events-none absolute -top-24 -left-24 z-0 h-96 w-96 rounded-full opacity-[0.06] blur-3xl" style={{ background: "radial-gradient(circle, #3F00FF 0%, transparent 70%)" }} />

        {/* Header Section */}
        <div className="relative z-10 text-center pt-16 pb-8 px-8">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-8 text-balance">{title}</h2>
        </div>

        {/* Desktop 3D overlapping layout - conditionally loaded */}
        {isDesktop && (
          <PortfolioGalleryDesktop
            images={images}
            maxHeight={maxHeight}
            spacing={spacing}
            onImageClick={onImageClick}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            SYMBOLS={SYMBOLS}
          />
        )}

        {/* Mobile marquee layout */}
        <div className="block md:hidden relative pb-8">
          <div
            className={cn(
              "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
              "flex-row"
            )}
          >
            {Array(marqueeRepeat)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex shrink-0 justify-around [gap:var(--gap)]",
                    "animate-marquee flex-row",
                    {
                      "group-hover:[animation-play-state:paused]": pauseOnHover,
                    }
                  )}
                >
                  {images.map((_image, index) => (
                    <div
                      key={`${i}-${index}`}
                      className="group cursor-pointer flex-shrink-0"
                      onClick={() => onImageClick?.(index)}
                    >
                      <div
                        className="relative aspect-[16/10] w-[320px] rounded-2xl overflow-hidden transition-all duration-300 group-hover:scale-[1.02]"
                        style={{
                          background: "rgba(255,255,255,0.09)",
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                          border: "1px solid rgba(255,255,255,0.14)",
                          boxShadow: "inset 0 1.5px 0 0 rgba(255,255,255,0.38), inset 0 -1px 0 0 rgba(0,0,0,0.05), 0 8px 32px rgba(0,0,0,0.35)",
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #08080f 0%, #0d0d1e 100%)" }}>
                          <div className="w-20 h-20 opacity-90">
                            {SYMBOLS[index % 6]}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
