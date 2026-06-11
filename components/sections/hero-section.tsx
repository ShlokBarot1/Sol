"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from "react"
import { MagneticButton } from "@/components/magnetic-button"
import { TrendingUp, ArrowRight, Zap, Target, BarChart3 } from "lucide-react"
import dynamic from "next/dynamic"
import { SolFooter } from "@/components/sections/sol-footer"

const StickyCapabilities = dynamic(
  () => import("@/components/sections/sticky-capabilities").then(m => ({ default: m.StickyCapabilities })),
  { ssr: false }
)

const WorkCarousel = dynamic(
  () => import("@/components/sections/work-carousel").then(m => ({ default: m.WorkCarousel })),
  { ssr: false, loading: () => <div className="w-full h-[540px]" /> }
)


interface HeroSectionProps {
  scrollToSection: (index: number) => void
  isLoaded: boolean
}

export const HeroSection = forwardRef<
  {
    getScrollElement: () => HTMLDivElement | null
    scrollToTop: () => void
    scrollToBottom: () => void
  },
  HeroSectionProps
>(({ scrollToSection, isLoaded }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const heroTaglineRef = useRef<HTMLDivElement>(null)
  const heroDescriptorRef = useRef<HTMLDivElement>(null)
  const heroLabelRef = useRef<HTMLParagraphElement>(null)
  const heroHeadingRef = useRef<HTMLHeadingElement>(null)
  const heroScrollRef = useRef<HTMLDivElement>(null)
  const cubeWrapperRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getScrollElement: () => scrollContainerRef.current,
    scrollToTop: () => scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
    scrollToBottom: () =>
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current!.scrollHeight,
        behavior: "smooth",
      }),
  }))

  useEffect(() => {
    // Cube is desktop-only (hidden md:block) — skip non-passive listener on mobile
    if (window.innerWidth < 768) return
    const wrapper = cubeWrapperRef.current
    if (!wrapper) return

    const onWheel = (e: WheelEvent) => e.preventDefault()
    wrapper.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      wrapper.removeEventListener("wheel", onWheel)
    }
  }, [])


  const stats = [
    { value: "500+", label: "Problems Solved", sublabel: "Worldwide" },
    { value: "30+", label: "Markets Reached", sublabel: "Global Footprint" },
    { value: "$2B+", label: "Value Created", sublabel: "Generated" },
  ]

  const processSteps = [
    { step: "01", title: "Diagnose", icon: Target, desc: "Find the real problem." },
    { step: "02", title: "Design", icon: BarChart3, desc: "Build the right solution." },
    { step: "03", title: "Deploy", icon: Zap, desc: "Execute with precision." },
    { step: "04", title: "Grow", icon: TrendingUp, desc: "Create lasting momentum." },
  ]

  const [showSpline, setShowSpline] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768)
  }, [])

  useEffect(() => {
    // Spline iframe is desktop-only (hidden md:block) — skip timer on mobile
    if (window.innerWidth < 768) return
    const timer = setTimeout(() => setShowSpline(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const glassCard = {
    background: isDesktop ? "rgba(255,255,255,0.06)" : "rgba(18,18,30,0.90)",
    ...(isDesktop ? { backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" } : {}),
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow:
      "inset 0 1.5px 0 0 rgba(255,255,255,0.30), inset 0 -1px 0 0 rgba(0,0,0,0.05), inset 1px 0 0 0 rgba(255,255,255,0.07), inset -1px 0 0 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.24), 0 2px 8px rgba(0,0,0,0.10)",
  } as React.CSSProperties

  const glassIconStyle = {
    background: isDesktop ? "rgba(63,0,255,0.10)" : "rgba(63,0,255,0.18)",
    ...(isDesktop ? { backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" } : {}),
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.24)",
  } as React.CSSProperties

  return (
    <div className="w-screen h-screen shrink-0 overflow-hidden relative">
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", overflowX: "clip" }}
      >

        {/* ─────────────────────────────── HERO SCREEN ─────────────────────────────── */}
        <div className="relative h-screen w-full">
          <div
            ref={heroTaglineRef}
            className={`absolute z-20 px-5 md:pl-10 md:pr-0 ${isLoaded ? "sol-hero-tagline-in" : "opacity-0"}`}
            style={{ top: "8rem", left: 0, maxWidth: "clamp(200px, 90vw, 54%)" }}
          >
            <p className="font-sans text-sm font-light leading-relaxed tracking-wide text-foreground/55">
              When markets shift, plans break, and certainty disappears, that&rsquo;s where we do our best work. SOL partners with leaders to uncover clarity, create direction, and build resilient businesses.
            </p>
          </div>

          <div
            ref={heroDescriptorRef}
            className={`absolute right-8 z-20 hidden md:flex md:flex-col md:right-12 ${isLoaded ? "sol-hero-desc-in" : "opacity-0"}`}
            style={{ top: "7.5rem" }}
          >
            <div className="mb-3 h-px w-36 bg-foreground/20" />
            <p className="max-w-[200px] font-mono text-[11px] leading-relaxed text-foreground/50">
              For organizations facing complexity, change, or a healthy amount of chaos.
            </p>
          </div>

          <div
            ref={cubeWrapperRef}
            className="absolute z-10 hidden md:block"
            style={{ left: "58%", top: "30%", right: 0, bottom: 0, overflow: "hidden", touchAction: "none" }}
          >
            {showSpline && (
              <iframe
                src="https://my.spline.design/rubik39scube-ZHK2eRc2iVc1q7zSaG5psIEl/?v=3"
                title="3D Rubik's Cube"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
                style={{
                  border: "none",
                  display: "block",
                  position: "absolute",
                  width: "152%",
                  height: "152%",
                  top: "-26%",
                  left: "-26%",
                  pointerEvents: "all",
                  transform: "scale(1.5)",
                  transformOrigin: "center center",
                }}
              />
            )}
          </div>

          <div className="absolute bottom-20 md:bottom-0 left-0 z-20 px-5 pb-1 md:px-0 md:pb-2" style={{ paddingLeft: undefined }}>
            <p
              ref={heroLabelRef}
              className={`font-mono uppercase tracking-widest text-foreground/30 ${isLoaded ? "sol-hero-label-in" : "opacity-0"} pl-0 md:pl-10`}
              style={{ fontSize: "0.65rem", marginBottom: "0.3rem" }}
            >
              Sometimes the best opportunities start with being
            </p>
            <h1
              ref={heroHeadingRef}
              data-lcp-heading
              className={`font-sans font-black text-foreground ${isLoaded ? "sol-hero-heading-in" : "opacity-0"} pl-0 md:pl-10`}
              style={{ fontSize: "clamp(96px, 21vw, 300px)", letterSpacing: "-0.04em", lineHeight: 0.84 }}
            >
              SOL
            </h1>
          </div>

          <div
            ref={heroScrollRef}
            className={`absolute bottom-7 right-8 z-20 flex items-center gap-3 md:right-12 ${isLoaded ? "sol-hero-scroll-in" : "opacity-0"}`}
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/30">Scroll</span>
            <div className="h-px w-8 bg-foreground/20" />
          </div>
        </div>

        {/* ─────────────────────────────── SERVICES ─────────────────────────────── */}

        {/* Desktop: GSAP sticky carousel — skipped on mobile to avoid loading GSAP/ScrollTrigger */}
        {isDesktop && (
          <div className="hidden md:block">
            <StickyCapabilities scroller={scrollContainerRef} onCardClick={() => scrollToSection(2)} />
          </div>
        )}

        {/* Mobile: static glassmorphic capability cards */}
        <div className="block md:hidden px-6 py-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ What We Do</p>
          <h2 className="font-sans text-2xl font-light tracking-tight text-foreground mb-8">
            When Growth Needs
            <br />
            <span className="text-foreground/35">More Than Luck</span>
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { num: "01", title: "AI", subtitle: "Innovation", tag: "Machine Learning", desc: "Intelligent systems that learn, adapt, and drive measurable outcomes across your business." },
              { num: "02", title: "Strategic", subtitle: "Marketing", tag: "Growth · Data-driven", desc: "Data-driven campaigns and brand strategies that compound over time." },
              { num: "03", title: "Digital", subtitle: "Transformation", tag: "End-to-end modernisation", desc: "End-to-end modernisation — from legacy systems to cloud-native architectures." },
              { num: "04", title: "Technology", subtitle: "Consulting", tag: "Strategy · Scale", desc: "Strategic technology roadmaps that align your stack with your growth trajectory." },
            ].map((service, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(2)}
                className="relative overflow-hidden rounded-2xl p-5 text-left w-full"
                style={{
                  background: "rgba(10,10,20,0.82)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: [
                    "inset 0 1.5px 0 0 rgba(255,255,255,0.48)",
                    "inset 0 -1px 0 0 rgba(255,255,255,0.07)",
                    "inset 1px 0 0 0 rgba(255,255,255,0.12)",
                    "inset -1px 0 0 0 rgba(255,255,255,0.12)",
                    "0 8px 32px rgba(0,0,0,0.28)",
                  ].join(", "),
                }}
              >
                {/* Glass sheen */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 35%, transparent 60%)" }}
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-[10px] tracking-[0.28em] text-white/25">{service.num} / 04</span>
                      <span
                        className="rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)" }}
                      >
                        {service.tag}
                      </span>
                    </div>
                    <p className="font-sans font-black leading-none text-white" style={{ fontSize: "clamp(1.6rem, 6vw, 2.2rem)", letterSpacing: "-0.04em", lineHeight: 0.88 }}>
                      {service.title}
                    </p>
                    <p className="font-sans font-extralight leading-none text-white/50 mb-3" style={{ fontSize: "clamp(1.6rem, 6vw, 2.2rem)", letterSpacing: "-0.04em", lineHeight: 0.88 }}>
                      {service.subtitle}
                    </p>
                    <p className="font-sans text-sm leading-relaxed text-white/40">{service.desc}</p>
                  </div>
                  <ArrowRight size={16} className="shrink-0 mt-1 text-white/20" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────── ABOUT / STATS ─────────────────────────────── */}
        <div
          id="hs-about"
          className="relative w-full px-6 py-24 md:px-12 md:py-28 lg:px-16"
          style={{ minHeight: "100vh" }}
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.055] blur-3xl hidden md:block"
            style={{ background: "radial-gradient(circle, #3F00FF 0%, transparent 70%)" }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Left */}
              <div id="hs-about-text">
                <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ Our Story</p>
                <h2 className="mb-8 font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Turning setbacks
                  <br />
                  into starting
                  <br />
                  <span className="text-foreground/35">points.</span>
                </h2>
                <div className="mb-10 max-w-lg space-y-4">
                  <p className="text-base leading-relaxed text-foreground/65">
                    Every organization faces moments that test its direction, resilience, and ambition.
                  </p>
                  <p className="text-base leading-relaxed text-foreground/65">
                    SOL was built to guide businesses through those moments, helping leaders transform uncertainty into strategy and challenges into measurable growth.
                  </p>
                </div>

              </div>

              {/* Right – stat cards */}
              <div className="flex flex-col gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="hs-stat-card relative overflow-hidden flex items-center gap-6 rounded-2xl p-6" style={glassCard}>
                    <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)" }} />
                    <div className="relative flex-shrink-0 min-w-[120px]">
                      <span className="font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl">
                        {stat.value}
                      </span>
                    </div>
                    <div className="border-l border-foreground/10 pl-6">
                      <p className="font-sans text-base font-medium text-foreground">{stat.label}</p>
                      <p className="mt-1 font-mono text-[11px] text-foreground/40">{stat.sublabel}</p>
                    </div>
                  </div>
                ))}

                {/* Award card */}
                <div className="hs-stat-card relative overflow-hidden flex items-center gap-6 rounded-2xl p-6" style={glassCard}>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)" }} />
                  <div className="relative flex-shrink-0 min-w-[120px]">
                    <span className="font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl">
                      #1
                    </span>
                  </div>
                  <div className="border-l border-foreground/10 pl-6">
                    <p className="font-sans text-base font-medium text-foreground">Trusted Strategic Partner</p>
                    <p className="mt-1 font-mono text-[11px] text-foreground/40">Digital Innovation Awards 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────── FEATURED WORK ─────────────────────────────── */}
        <div
          id="hs-featured"
          className="relative w-full py-10 md:py-20"
        >
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full opacity-[0.06] blur-3xl hidden md:block"
            style={{ background: "radial-gradient(circle, #4400FF 0%, transparent 70%)" }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16">
            <div id="hs-featured-heading" className="mb-8 md:mb-14 flex items-end justify-between">
              <div>
                <p className="mb-3 md:mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ SOL Stories</p>
                <h2 className="font-sans text-3xl md:text-5xl font-light tracking-tight text-foreground md:text-6xl">
                  From SOL To Success.
                </h2>
              </div>
              <button
                onClick={() => scrollToSection(1)}
                className="group hidden items-center gap-2 text-foreground/35 transition-colors hover:text-foreground/70 md:flex"
              >
                <span className="font-mono text-xs">View all cases</span>
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Desktop: Swiper carousel — skipped on mobile to avoid loading Swiper.js */}
          {isDesktop && (
            <div className="relative z-10 w-full hidden md:block">
              <WorkCarousel onViewAll={() => scrollToSection(1)} />
            </div>
          )}

          {/* Mobile: static glassmorphic cards */}
          <div className="block md:hidden px-5 space-y-4">
            {[
              { title: "Revolutionary Social Media Platform", client: "Confidential", category: "Platform Development", metric: "400%", metricLabel: "User Growth", impacts: ["400% user growth in 12 months", "Strategic brand partnerships", "Acquired at premium multiple"] },
              { title: "Luxury Hospitality Transformation", client: "EMA Hospitality", category: "Digital Transformation", metric: "375%", metricLabel: "ROI Year 1", impacts: ["Digital-first guest experience", "Revenue management AI", "Occupancy up 28%"] },
              { title: "Global Ministry Digital Reach", client: "Bill Winston Ministries", category: "Tech Modernization", metric: "250%", metricLabel: "Engagement ↑", impacts: ["Streaming infrastructure rebuilt", "Multilingual content delivery", "Mobile-first in 190+ nations"] },
            ].map((item, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl p-5"
                style={{
                  background: "rgba(22,22,35,0.92)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
                }}
              >
                {/* Specular sheen */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 35%, transparent 65%)" }}
                />
                <div className="relative">
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
                      style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.75)" }}
                    >
                      {item.category}
                    </span>
                    <span className="font-mono text-[10px] text-foreground/35">{item.client}</span>
                  </div>
                  {/* Metric */}
                  <p className="font-sans font-light leading-none text-foreground mb-1" style={{ fontSize: 52, letterSpacing: "-0.04em" }}>
                    {item.metric}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 mb-3">{item.metricLabel}</p>
                  {/* Title */}
                  <h3 className="font-sans font-light text-foreground text-base leading-snug mb-4">{item.title}</h3>
                  {/* Impacts */}
                  <ul className="space-y-1.5">
                    {item.impacts.map((impact, ii) => (
                      <li key={ii} className="flex items-start gap-2">
                        <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-foreground/30" />
                        <span className="text-sm text-foreground/50 leading-relaxed">{impact}</span>
                      </li>
                    ))}
                  </ul>
                  {/* CTA */}
                  <button
                    onClick={() => scrollToSection(1)}
                    className="mt-5 flex items-center gap-2 text-foreground/40"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-widest">View all cases</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─────────────────────────────── PROCESS ─────────────────────────────── */}
        <div
          id="hs-process"
          className="relative w-full px-6 py-16 md:py-20 lg:px-16"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05] blur-3xl hidden md:block"
            style={{ background: "radial-gradient(circle, #3F00FF 0%, transparent 70%)" }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="mb-16">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ How We Work</p>
              <h2 className="font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl">
                From Stuck
                <br />
                <span className="text-foreground/35">to Strategic.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="hs-process-step relative overflow-hidden flex flex-col gap-5 rounded-2xl p-7" style={glassCard}>
                    <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)" }} />
                    <div className="relative flex items-start justify-between">
                      <span className="font-mono text-3xl font-light text-foreground/10">{item.step}</span>
                      <div
                        className="rounded-lg p-2"
                        style={glassIconStyle}
                      >
                        <Icon size={15} className="text-primary/70" />
                      </div>
                    </div>
                    <h3 className="relative font-sans text-xl font-light text-foreground">{item.title}</h3>
                    <p className="relative text-sm leading-relaxed text-foreground/50">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────── CTA ─────────────────────────────── */}
        <div
          id="hs-cta"
          className="relative flex w-full items-center px-6 py-20 md:px-12 lg:px-16"
        >
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="h-[450px] w-[650px] rounded-full opacity-[0.07] blur-3xl hidden md:block"
              style={{ background: "radial-gradient(circle, #3F00FF 0%, transparent 70%)" }}
            />
          </div>

          <div id="hs-cta-content" className="relative z-10 mx-auto w-full max-w-7xl text-center">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ Get Started</p>
            <h2 className="mb-6 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
              When Luck Runs Out,
              <br />
              <span className="text-foreground/35">We Show Up.</span>
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-base leading-relaxed text-foreground/55">
              Let&rsquo;s build your digital future together. Our team is ready to partner with you on your most
              ambitious challenges.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection(4)}>
                Get a Consultation
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection(1)}>
                View Case Studies
              </MagneticButton>
            </div>
          </div>
        </div>

        <SolFooter scrollToSection={scrollToSection} />
      </div>

      <style>{`
        @keyframes sol-hero-fade-up-sm {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sol-hero-fade-right {
          from { opacity: 0; transform: translateX(14px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sol-hero-fade-up-xs {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sol-hero-slide-up-lg {
          from { opacity: 0; transform: translateY(72px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sol-hero-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .sol-hero-tagline-in { animation: sol-hero-fade-up-sm   0.9s cubic-bezier(0.215,0.61,0.355,1) 0.25s both; }
        .sol-hero-desc-in    { animation: sol-hero-fade-right   0.75s cubic-bezier(0.215,0.61,0.355,1) 0.5s both; }
        .sol-hero-label-in   { animation: sol-hero-fade-up-xs   0.6s cubic-bezier(0.215,0.61,0.355,1) 0.65s both; }
        .sol-hero-heading-in { animation: sol-hero-slide-up-lg  1.1s cubic-bezier(0.16,1,0.3,1) 0.7s both; }
        .sol-hero-scroll-in  { animation: sol-hero-fade-in      0.6s cubic-bezier(0.215,0.61,0.355,1) 0.85s both; }
        @media (max-width: 767px) {
          /* On mobile, skip all animation delays so LCP element is immediately visible
             when the loading screen lifts. The 700ms heading delay alone accounts for
             ~2-3s of LCP on throttled hardware. */
          .sol-hero-heading-in,
          .sol-hero-label-in,
          .sol-hero-tagline-in,
          .sol-hero-scroll-in {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .sol-hero-tagline-in, .sol-hero-desc-in, .sol-hero-label-in,
          .sol-hero-heading-in, .sol-hero-scroll-in {
            animation-duration: 0.01ms;
            animation-delay: 0ms;
          }
        }
      `}</style>
    </div>
  )
})

HeroSection.displayName = "HeroSection"
