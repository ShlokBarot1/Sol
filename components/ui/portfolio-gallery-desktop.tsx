"use client"

import { motion } from "motion/react"
import React from "react"

export function PortfolioGalleryDesktop({
  images,
  maxHeight,
  spacing,
  onImageClick,
  hoveredIndex,
  setHoveredIndex,
  SYMBOLS
}: any) {
  return (
    <div className="hidden md:block relative overflow-hidden h-[500px] -mb-[200px]">
      <div className={`flex ${spacing} pb-8 pt-40 items-end justify-center`}>
        {images.map((image: any, index: number) => {
          // Calculate stagger height - peak in middle, descending to edges
          const totalImages = images.length
          const middle = Math.floor(totalImages / 2)
          const distanceFromMiddle = Math.abs(index - middle)
          const staggerOffset = maxHeight - distanceFromMiddle * 25

          const zIndex = totalImages - index

          const isHovered = hoveredIndex === index
          const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index

          // When hovering: hovered card moves to consistent top position, others move to baseline
          const yOffset = isHovered ? -140 : isOtherHovered ? 0 : -staggerOffset

          return (
            <motion.div
              key={index}
              className="group cursor-pointer flex-shrink-0"
              style={{
                zIndex: zIndex,
              }}
              initial={{
                transform: `perspective(5000px) rotateY(-45deg) translateY(200px)`,
                opacity: 0,
              }}
              animate={{
                transform: `perspective(5000px) rotateY(-45deg) translateY(${yOffset}px)`,
                opacity: 1,
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <div
                className="relative aspect-[16/10] w-[500px] lg:w-[700px] rounded-2xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02]"
                onClick={() => {
                  onImageClick?.(index);
                }}
                style={{
                  background: "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow:
                    "inset 0 1.5px 0 0 rgba(255,255,255,0.42), inset 0 -1px 0 0 rgba(0,0,0,0.06), inset 1px 0 0 0 rgba(255,255,255,0.10), inset -1px 0 0 0 rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.40), 0 4px 12px rgba(0,0,0,0.20)",
                }}
              >
                {/* Apple Liquid Glass: top specular */}
                <div className="absolute inset-x-0 top-0 z-20 h-[1.5px]" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 30%, rgba(255,255,255,0.80) 50%, rgba(255,255,255,0.65) 70%, transparent 100%)" }} />
                {/* Apple Liquid Glass: refraction lensing */}
                <div className="pointer-events-none absolute inset-0 z-10" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 35%, transparent 60%)" }} />
                {/* Hover shimmer */}
                <div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(63,0,255,0.06) 50%, transparent 80%)" }} />

                  {/* Dark base */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #08080f 0%, #0d0d1e 100%)" }} />

                {/* Symbol — upper center */}
                <div className="absolute top-6 left-0 right-0 flex justify-center">
                  <div className="w-56 h-56 opacity-90">
                    {SYMBOLS[index % 6]}
                  </div>
                </div>

                {/* Title label */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <p className="text-xs font-mono text-white/60 tracking-widest uppercase">{image.title || image.alt}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
