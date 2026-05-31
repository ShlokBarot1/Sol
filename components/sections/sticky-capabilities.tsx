"use client"

import React, { useRef, useEffect } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  { num: "01", words: ["AI",          "Innovation"    ], asset: "/cross.png",  tag: "Machine Learning",        imgPos: { top: "12%", right: "8%" } },
  { num: "02", words: ["Strategic",   "Marketing"     ], asset: "/cube.png",   tag: "Growth · Data-driven",    imgPos: { top: "10%", right: "6%" } },
  { num: "03", words: ["Digital",     "Transformation"], asset: "/torus.png",  tag: "End-to-end modernisation", imgPos: { top: "14%", right: "9%" } },
  { num: "04", words: ["Technology",  "Consulting"    ], asset: "/spring.png", tag: "Strategy · Scale",        imgPos: { top: "11%", right: "7%" } },
]

const glassCard: React.CSSProperties = {
  background: "rgba(10,10,20,0.42)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.20)",
  boxShadow: [
    "inset 0 1.5px 0 0 rgba(255,255,255,0.50)",
    "inset 0 -1px 0 0 rgba(255,255,255,0.08)",
    "inset 1px 0 0 0 rgba(255,255,255,0.14)",
    "inset -1px 0 0 0 rgba(255,255,255,0.14)",
    "0 16px 64px rgba(0,0,0,0.35)",
    "0 2px 12px rgba(0,0,0,0.18)",
  ].join(", "),
}

interface ServiceCardProps {
  num: string
  words: string[]
  asset: string
  tag: string
  imgPos: React.CSSProperties
  onClick?: () => void
}

function ServiceCard({ num, words, asset, tag, imgPos, onClick }: ServiceCardProps) {
  const imgRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(imgRef.current, { x: x * 28, y: y * 28, duration: 0.4, ease: "power2.out" })
  }

  const handleMouseLeave = () => {
    gsap.to(imgRef.current, { x: 0, y: 0, duration: 0.7, ease: "power3.out" })
  }

  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl" style={{ ...glassCard, transformOrigin: "top center", cursor: onClick ? "pointer" : "default" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Top-edge specular — primary light hit */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px rounded-t-3xl"
        style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.75) 40%, rgba(255,255,255,0.75) 60%, transparent 95%)" }} />

      {/* Corner-to-corner glass sheen */}
      <div className="pointer-events-none absolute inset-0 z-10 rounded-3xl"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 30%, transparent 55%)" }} />

      {/* Bottom-edge inner reflection */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-px rounded-b-3xl"
        style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.12) 60%, transparent 90%)" }} />

      {/* Caustic lensing — diffuse bright blob offset from center */}
      <div className="pointer-events-none absolute z-10 rounded-full"
        style={{
          width: "55%", height: "45%", top: "5%", left: "20%",
          background: "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.07) 0%, transparent 70%)",
          filter: "blur(18px)",
        }} />


      {/* PNG — contained within card */}
      <div
        ref={imgRef}
        className="pointer-events-none absolute z-10"
        style={{ width: "58%", height: "72%", ...imgPos, willChange: "transform" }}
      >
        <Image src={asset} alt="" fill className="object-contain" sizes="(max-width: 640px) 180px, 290px" style={{ opacity: 0.92 }} />
      </div>

      {/* title stack — bottom-left */}
      <div className="absolute bottom-16 left-8 z-20">
        <p className="font-sans font-black leading-none text-white"
          style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", letterSpacing: "-0.05em", lineHeight: 0.85 }}>
          {words[0]}
        </p>
        <p className="font-sans font-extralight leading-none text-white/55"
          style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", letterSpacing: "-0.05em", lineHeight: 0.85 }}>
          {words[1]}
        </p>
      </div>

      {/* num — top-left */}
      <div className="absolute left-8 top-8 z-20">
        <span className="font-mono text-xs tracking-[0.3em] text-white/25">{num} / 04</span>
      </div>

      {/* tag — bottom-right */}
      <div className="absolute bottom-5 right-8 z-20 text-right">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30">{tag}</span>
      </div>
    </div>
  )
}

interface StickyCapabilitiesProps {
  scroller: React.RefObject<HTMLDivElement | null>
  onCardClick?: () => void
}

export function StickyCapabilities({ scroller, onCardClick }: StickyCapabilitiesProps) {
  const stickyRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const id = setTimeout(() => {
      const scrollerEl = scroller.current
      if (!scrollerEl || !stickyRef.current) return

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.set(card, { y: i === 0 ? "0%" : "100%", scale: 1, zIndex: i + 1 })
      })

      tlRef.current = gsap.timeline({
        scrollTrigger: {
          trigger: stickyRef.current,
          scroller: scrollerEl,
          start: "top top",
          end: `+=${window.innerHeight * (SERVICES.length - 1)}`,
          pin: true,
          pinType: "transform",
          scrub: 0.5,
          pinSpacing: true,
        },
      })

      for (let i = 0; i < SERVICES.length - 1; i++) {
        const cur = cardRefs.current[i]
        const next = cardRefs.current[i + 1]
        if (!cur || !next) continue
        tlRef.current.to(cur, { scale: 0.88, duration: 1, ease: "none" }, i)
        tlRef.current.to(next, { y: "0%", duration: 1, ease: "none" }, i)
      }
    }, 100)

    return () => {
      clearTimeout(id)
      ;(tlRef.current as gsap.core.Timeline & { scrollTrigger?: { kill: () => void } })?.scrollTrigger?.kill()
      tlRef.current?.kill()
    }
  }, [scroller])

  return (
    <div id="hs-services" className="relative w-full overflow-hidden px-6 md:px-12 lg:px-16">
      <div ref={stickyRef} className="sticky-cards relative w-full" style={{ height: "100vh" }}>
        {/* Section header */}
        <div className="relative z-20 mx-auto w-full max-w-7xl flex items-end justify-between pb-6 pt-12">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ What We Do</p>
            <h2 className="font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl">
              Capabilities built for
              <br />
              <span className="text-foreground/35">digital-first growth</span>
            </h2>
          </div>
          <div className="hidden shrink-0 flex-col items-end gap-1 lg:flex">
            <span className="font-sans text-6xl font-light leading-none text-foreground/[0.08]">04</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/25">Core Services</span>
          </div>
        </div>

        {/* Card stack */}
        <div
          className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl"
          style={{ height: "56vh", minHeight: "360px", maxHeight: "500px" }}
        >
          {SERVICES.map((service, i) => (
            <div
              key={i}
              ref={(el) => { cardRefs.current[i] = el }}
              className="absolute inset-0 rounded-3xl"
            >
              <ServiceCard
                num={service.num}
                words={service.words}
                asset={service.asset}
                tag={service.tag}
                imgPos={service.imgPos}
                onClick={onCardClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
