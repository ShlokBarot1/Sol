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
    const wrapper = cubeWrapperRef.current
    if (!wrapper) return

    const onWheel = (e: WheelEvent) => e.preventDefault()
    wrapper.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      wrapper.removeEventListener("wheel", onWheel)
    }
  }, [])


  const stats = [
    { value: "500+", label: "Projects Delivered", sublabel: "Worldwide" },
    { value: "30+", label: "Countries", sublabel: "Global Footprint" },
    { value: "$2B+", label: "Client Value", sublabel: "Generated" },
  ]

  const processSteps = [
    { step: "01", title: "Discover", icon: Target, desc: "Deep-dive into your goals, challenges, and untapped opportunities." },
    { step: "02", title: "Strategize", icon: BarChart3, desc: "Craft bespoke roadmaps aligned to your vision and market dynamics." },
    { step: "03", title: "Execute", icon: Zap, desc: "Implement with precision — agile, data-driven, and results-focused." },
    { step: "04", title: "Scale", icon: TrendingUp, desc: "Continuously optimise and expand to sustain competitive advantage." },
  ]

  const glassCard = {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.13)",
    boxShadow:
      "inset 0 1.5px 0 0 rgba(255,255,255,0.30), inset 0 -1px 0 0 rgba(0,0,0,0.05), inset 1px 0 0 0 rgba(255,255,255,0.07), inset -1px 0 0 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.24), 0 2px 8px rgba(0,0,0,0.10)",
  } as React.CSSProperties

  const glassIconStyle = {
    background: "rgba(63,0,255,0.10)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    border: "1px solid rgba(255,255,255,0.16)",
    boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.24)",
  } as React.CSSProperties


  const [showSpline, setShowSpline] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowSpline(true), 2000)
    return () => clearTimeout(timer)
  }, [])

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
            className={`absolute z-20 ${isLoaded ? "sol-hero-tagline-in" : "opacity-0"}`}
            style={{ top: "8rem", left: "2.5rem", maxWidth: "clamp(200px, 80vw, 54%)" }}
          >
            <p className="font-sans text-sm font-light leading-relaxed tracking-wide text-foreground/55">
              SOL Advisers partners with forward-thinking organizations to drive digital innovation and create lasting competitive advantage.
            </p>
          </div>

          <div
            ref={heroDescriptorRef}
            className={`absolute right-8 z-20 hidden md:flex md:flex-col md:right-12 ${isLoaded ? "sol-hero-desc-in" : "opacity-0"}`}
            style={{ top: "7.5rem" }}
          >
            <div className="mb-3 h-px w-36 bg-foreground/20" />
            <p className="max-w-[200px] font-mono text-[11px] leading-relaxed text-foreground/50">
              Strategic advisory for bold organizations shaping the digital future.
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

          <div className="absolute bottom-0 left-0 z-20" style={{ paddingLeft: "2.5rem", paddingBottom: "0.5rem" }}>
            <p
              ref={heroLabelRef}
              className={`font-mono uppercase tracking-widest text-foreground/30 ${isLoaded ? "sol-hero-label-in" : "opacity-0"}`}
              style={{ fontSize: "0.65rem", marginBottom: "0.3rem" }}
            >
              Strategic Advisory
            </p>
            <h1
              ref={heroHeadingRef}
              data-lcp-heading
              className={`font-sans font-black text-foreground ${isLoaded ? "sol-hero-heading-in" : "opacity-0"}`}
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
        <StickyCapabilities scroller={scrollContainerRef} onCardClick={() => scrollToSection(2)} />

        {/* ─────────────────────────────── ABOUT / STATS ─────────────────────────────── */}
        <div
          id="hs-about"
          className="relative w-full px-6 py-24 md:px-12 md:py-28 lg:px-16"
          style={{ minHeight: "100vh" }}
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.055] blur-3xl"
            style={{ background: "radial-gradient(circle, #3F00FF 0%, transparent 70%)" }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
              {/* Left */}
              <div id="hs-about-text">
                <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ Our Story</p>
                <h2 className="mb-8 font-sans text-4xl font-light leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Innovation
                  <br />
                  at the core of
                  <br />
                  <span className="text-foreground/35">strategy</span>
                </h2>
                <div className="mb-10 max-w-lg space-y-4">
                  <p className="text-base leading-relaxed text-foreground/65">
                    SOL Advisers is a global consultancy focused on digital transformation and innovation.
                  </p>
                  <p className="text-base leading-relaxed text-foreground/65">
                    We partner with forward-thinking organizations to drive innovation, accelerate growth, and create
                    lasting competitive advantages across 30+ countries.
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
                    <p className="font-sans text-base font-medium text-foreground">Global Consultancy of the Year</p>
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
          className="relative w-full py-16 md:py-20"
        >
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full opacity-[0.06] blur-3xl"
            style={{ background: "radial-gradient(circle, #4400FF 0%, transparent 70%)" }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-16">
            <div id="hs-featured-heading" className="mb-14 flex items-end justify-between">
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ Selected Work</p>
                <h2 className="font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl">
                  Work that speaks volumes
                  <br />
                  <span className="text-foreground"></span>
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

          <div className="relative z-10 w-full">
            <WorkCarousel onViewAll={() => scrollToSection(1)} />
          </div>
        </div>

        {/* ─────────────────────────────── PROCESS ─────────────────────────────── */}
        <div
          id="hs-process"
          className="relative w-full px-6 py-16 md:py-20 lg:px-16"
        >
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.05] blur-3xl"
            style={{ background: "radial-gradient(circle, #3F00FF 0%, transparent 70%)" }}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl">
            <div className="mb-16">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ How We Work</p>
              <h2 className="font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl">
                A proven process
                <br />
                <span className="text-foreground/35">for transformation</span>
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
              className="h-[450px] w-[650px] rounded-full opacity-[0.07] blur-3xl"
              style={{ background: "radial-gradient(circle, #3F00FF 0%, transparent 70%)" }}
            />
          </div>

          <div id="hs-cta-content" className="relative z-10 mx-auto w-full max-w-7xl text-center">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">/ Get Started</p>
            <h2 className="mb-6 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Ready to transform
              <br />
              <span className="text-foreground/35">your organization?</span>
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
