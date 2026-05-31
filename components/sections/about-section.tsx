"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MagneticButton } from "@/components/magnetic-button"
import dynamic from "next/dynamic"
import { SolFooter } from "@/components/sections/sol-footer"
import type { GlobeMarker } from "@/components/ui/wireframe-dotted-globe"

const RotatingEarth = dynamic(
  () => import("@/components/ui/wireframe-dotted-globe"),
  { ssr: false }
)

gsap.registerPlugin(ScrollTrigger)

const CITY_MARKERS: GlobeMarker[] = [
  { name: "United States", lng: -96.80, lat: 32.78 },
  { name: "China", lng: 116.39, lat: 39.91 },
  { name: "UK", lng: -0.13, lat: 51.51 },
  { name: "India", lng: 77.59, lat: 12.97 },
  { name: "Germany", lng: 13.40, lat: 52.52 },
  { name: "Israel", lng: 34.78, lat: 32.08 },
  { name: "Canada", lng: -79.38, lat: 43.65 },
  { name: "France", lng: 2.35, lat: 48.85 },
  { name: "Sweden", lng: 18.07, lat: 59.33 },
  { name: "Netherlands", lng: 4.90, lat: 52.37 },
  { name: "Singapore", lng: 103.82, lat: 1.35 },
  { name: "Japan", lng: 139.69, lat: 35.68 },
  { name: "South Korea", lng: 126.98, lat: 37.57 },
  { name: "Australia", lng: 151.21, lat: -33.87 },
  { name: "Switzerland", lng: 8.54, lat: 47.38 },
  { name: "Ireland", lng: -6.25, lat: 53.33 },
  { name: "Taiwan", lng: 121.56, lat: 25.03 },
  { name: "Poland", lng: 21.01, lat: 52.23 },
  { name: "Spain", lng: 2.15, lat: 41.39 },
  { name: "Brazil", lng: -46.63, lat: -23.55 },
  { name: "Mexico", lng: -99.13, lat: 19.43 },
  { name: "UAE", lng: 55.27, lat: 25.20 },
  { name: "Estonia", lng: 24.75, lat: 59.44 },
  { name: "Chile", lng: -70.67, lat: -33.45 },
  { name: "Finland", lng: 24.94, lat: 60.17 },
  { name: "Denmark", lng: 12.57, lat: 55.68 },
  { name: "Norway", lng: 10.75, lat: 59.91 },
  { name: "Belgium", lng: 4.35, lat: 50.85 },
  { name: "Italy", lng: 9.19, lat: 45.46 },
  { name: "South Africa", lng: 18.42, lat: -33.93 },
  { name: "Greece", lng: 23.73, lat: 37.98 },
  { name: "Serbia", lng: 20.46, lat: 44.82 },
  { name: "Montenegro", lng: 19.26, lat: 42.44 },
]

const LINE_OPACITIES = [1, 0.55, 0.22]
const GLOBE_SIZE = 700

const VALUES = [
  {
    num: "01",
    title: "Meaningful Innovation",
    desc: "We craft strategies that carry weight. Before shaping your digital future, we invest in understanding your business, your market, and what makes you different.",
  },
  {
    num: "02",
    title: "Strategic Thinking",
    desc: "Creative solutions guided by data and experience. Every recommendation is backed by research, benchmarks, and a deep understanding of your competitive landscape.",
  },
  {
    num: "03",
    title: "Integrated Expertise",
    desc: "Bringing together AI, digital transformation, asset management, and strategic marketing under one roof for seamless end-to-end execution.",
  },
  {
    num: "04",
    title: "Long-Term Partnership",
    desc: "We don't just deliver projects. We build lasting partnerships that evolve with your business and continuously drive new value over time.",
  },
]

export const AboutSection = forwardRef<
  { getScrollElement: () => HTMLDivElement | null; scrollToTop: () => void; scrollToBottom: () => void },
  { scrollToSection?: (index: number) => void; isCurrent?: boolean }
>(({ scrollToSection, isCurrent }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const counter2Ref = useRef<HTMLSpanElement>(null)
  const counter3Ref = useRef<HTMLSpanElement>(null)
  const counterAnimatedRef = useRef(false)
  const counter3AnimatedRef = useRef(false)
  const markerOpacityRef = useRef<number>(0)
  const hasSetupRef = useRef(false)
  const gsapCtxRef = useRef<ReturnType<typeof gsap.context> | null>(null)

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
    if (!isCurrent || counterAnimatedRef.current) return
    counterAnimatedRef.current = true

    const c1 = { val: 0 }
    gsap.to(c1, {
      val: 500,
      duration: 2.4,
      ease: "power2.out",
      delay: 0.5,
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(c1.val))
      },
    })

    const c2 = { val: 0 }
    gsap.to(c2, {
      val: 95,
      duration: 2.0,
      ease: "power2.out",
      delay: 0.8,
      onUpdate: () => {
        if (counter2Ref.current) counter2Ref.current.textContent = String(Math.round(c2.val))
      },
    })
  }, [isCurrent])


  useEffect(() => {
    gsap.set(".about-countries-panel", { opacity: 0, x: 40 })
    gsap.set(".about-globe-wrap", { yPercent: 120, scale: 0.28, opacity: 0, transformOrigin: "center center" })
  }, [])

  useEffect(() => {
    return () => { gsapCtxRef.current?.revert() }
  }, [])

  useEffect(() => {
    const scroller = scrollContainerRef.current
    if (!scroller || !isCurrent || hasSetupRef.current) return
    hasSetupRef.current = true

    const ctx = gsap.context(() => {
      // ── Screen 1 text reveals ──
      gsap.utils.toArray<HTMLElement>(".abt-line").forEach((line, i) => {
        gsap.fromTo(
          line,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "power4.out",
            delay: i * 0.11,
            scrollTrigger: {
              trigger: line.parentElement,
              scroller,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        )
      })

      gsap.utils.toArray<HTMLElement>(".abt-fade").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        )
      })

      gsap.fromTo(
        ".abt-stat-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".abt-stat-card",
            scroller,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      )

      // 180vh zone → sticky releases at "top -80%"
      // Delay: "top 90%" → "top 50%"  = 40vh scroll before rise begins
      // Rise:  "top 50%" → "top 10%"  = 40vh scroll
      // Dwell: "top 10%" → "top -10%" = 20vh
      // Exit:  "top -10%" → "top -50%" = 40vh scroll

      gsap.to(".about-globe-wrap", {
        yPercent: 0,
        opacity: 1,
        scale: () => Math.min(Math.min(window.innerWidth * 0.65, window.innerHeight * 0.78) / GLOBE_SIZE, 0.92),
        ease: "none",
        scrollTrigger: {
          trigger: ".about-globe-zone",
          scroller,
          start: "top 70%",
          end: "top -18%",
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            markerOpacityRef.current = Math.max(0, (self.progress - 0.55) / 0.45)
          },
        },
      })

      gsap.to(".about-countries-panel", {
        opacity: 1,
        x: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-globe-zone",
          scroller,
          start: "top 55%",
          end: "top -23%",
          scrub: 1,
          onEnter: () => {
            if (counter3AnimatedRef.current) return
            counter3AnimatedRef.current = true
            const c3 = { val: 0 }
            gsap.to(c3, {
              val: 30,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                if (counter3Ref.current) counter3Ref.current.textContent = String(Math.round(c3.val))
              },
            })
          },
        },
      })

      // Globe: gentle tilt during dwell phase
      gsap.fromTo(".about-globe-wrap",
        { rotationZ: -4 },
        {
          rotationZ: 4,
          ease: "sine.inOut",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".about-globe-zone",
            scroller,
            start: "top -18%",
            end: "top -68%",
            scrub: 2,
          },
        }
      )

      // Globe canvas: elastic spring scale settle on entry
      ScrollTrigger.create({
        trigger: ".about-globe-zone",
        scroller,
        start: "top -18%",
        once: true,
        onEnter: () => {
          gsap.fromTo(".about-globe-wrap canvas",
            { scale: 1.1 },
            { scale: 1, duration: 1.4, ease: "elastic.out(1, 0.5)" }
          )
        },
      })

      // Globe canvas: subtle counter-parallax — canvas drifts opposite to scroll for depth
      gsap.fromTo(".about-globe-wrap canvas",
        { y: -18 },
        {
          y: 18,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".about-globe-zone",
            scroller,
            start: "top -18%",
            end: "top -68%",
            scrub: 1.5,
          },
        }
      )

      // Exit: globe floats UP smoothly and fades out
      gsap.fromTo(".about-globe-wrap",
        { yPercent: 0, opacity: 1 },
        {
          yPercent: -70,
          opacity: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".about-globe-zone",
            scroller,
            start: "top -68%",
            end: "top -78%",
            scrub: 1,
          },
        }
      )

      gsap.fromTo(".about-countries-panel",
        { opacity: 1, x: 0 },
        {
          opacity: 0,
          x: -30,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".about-globe-zone",
            scroller,
            start: "top -68%",
            end: "top -78%",
            scrub: 1,
          },
        }
      )

      // ── Values ──
      gsap.utils.toArray<HTMLElement>(".abt-value").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            delay: i * 0.09,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        )
      })

      // ── CTA ──
      gsap.fromTo(
        ".abt-cta",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".abt-cta",
            scroller,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      )
    }, scroller)

    gsapCtxRef.current = ctx
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }, [isCurrent])

  const cardGlass = {
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.07)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
  } as React.CSSProperties

  return (
    <section className="relative flex h-screen w-screen shrink-0 overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* ── Screen 1: normal scroll, no sticky ── */}
        <div className="relative flex min-h-screen flex-col justify-between px-6 pb-12 pt-24 md:px-12 md:pt-28 lg:px-16">

          {/* Top row */}
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="md:max-w-[58%]">
              <p className="abt-fade mb-5 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-foreground/40">
                About SOL Advisers
              </p>
              <h1
                className="font-sans font-bold leading-[1.0] tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 3.6vw, 4.4rem)" }}
              >
                {["Full-service AI", "& digital strategy", "built for impact."].map((line, i) => (
                  <span
                    key={i}
                    className="block overflow-hidden py-[0.1em]"
                    style={{ opacity: LINE_OPACITIES[i] }}
                  >
                    <span className="abt-line block text-foreground">{line}</span>
                  </span>
                ))}
              </h1>
            </div>

            <div className="flex flex-col gap-6 md:max-w-[36%] md:pt-[3vw]">
              <p className="abt-fade font-sans text-base leading-relaxed text-foreground/60 md:text-[1.05rem]">
                SOL Advisers partners with forward-thinking organizations to drive innovation, accelerate growth,
                and create lasting competitive advantages through AI and digital transformation.
              </p>
              <div className="abt-fade">
                <MagneticButton variant="secondary" onClick={() => scrollToSection?.(4)}>
                  Start a Project →
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Stat cards — bottom right */}
          <div className="flex justify-end">
            <div className="flex w-full flex-col gap-3 md:max-w-[42%]">
              <div className="abt-stat-card rounded-2xl px-8 py-8" style={cardGlass}>
                <div
                  className="font-sans font-bold leading-none tracking-tight text-foreground/80"
                  style={{ fontSize: "clamp(3.5rem, 7vw, 8rem)" }}
                >
                  <span ref={counterRef}>0</span>
                  <span>+</span>
                </div>
                <div className="mt-3 font-sans text-base font-medium text-foreground/55 md:text-lg">
                  Projects Delivered
                </div>
                <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-foreground/30">
                  Worldwide
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="abt-stat-card rounded-2xl px-5 py-6" style={cardGlass}>
                  <div
                    className="font-sans font-bold leading-none tracking-tight text-foreground/75"
                    style={{ fontSize: "clamp(2rem, 4vw, 4.5rem)" }}
                  >
                    <span ref={counter2Ref}>0</span>
                    <span>%</span>
                  </div>
                  <div className="mt-3 font-sans text-sm font-medium text-foreground/55">
                    Client Satisfaction
                  </div>
                  <div className="mt-1 font-mono text-[0.6rem] leading-snug text-foreground/30">
                    Consistently exceeding expectations
                  </div>
                </div>

                <div className="abt-stat-card rounded-2xl px-5 py-6" style={cardGlass}>
                  <div
                    className="font-sans font-bold leading-none tracking-tight text-foreground/75"
                    style={{ fontSize: "clamp(2rem, 4vw, 4.5rem)" }}
                  >
                    $2B+
                  </div>
                  <div className="mt-3 font-sans text-sm font-medium text-foreground/55">
                    Client Value
                  </div>
                  <div className="mt-1 font-mono text-[0.6rem] leading-snug text-foreground/30">
                    Generated through our solutions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Screen 2: Values ── */}
        <div className="min-h-screen px-6 py-20 md:px-12 md:py-28 lg:px-16">
          <div className="mb-14 md:mb-20">
            <p className="abt-fade mb-4 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-foreground/40">
              What drives us
            </p>
            <div className="overflow-hidden">
              <h2
                className="abt-line font-sans font-bold tracking-tight text-foreground"
                style={{ fontSize: "clamp(2.5rem, 5.5vw, 6.5rem)" }}
              >
                Our Values
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {VALUES.map((value, i) => (
              <div
                key={i}
                className="abt-value py-9 md:py-12"
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  borderRight: i % 2 === 0 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  paddingLeft: i % 2 === 1 ? "clamp(1.5rem, 3vw, 3.5rem)" : "0",
                  paddingRight: i % 2 === 0 ? "clamp(1.5rem, 3vw, 3.5rem)" : "0",
                }}
              >
                <div className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-foreground/30">
                  {value.num}
                </div>
                <h3 className="mb-4 font-sans text-xl font-semibold text-foreground md:text-2xl">{value.title}</h3>
                <p className="max-w-sm font-sans text-sm leading-relaxed text-foreground/55 md:text-[0.95rem]">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-foreground/[0.08] md:mx-12 lg:mx-16" />

        {/* ── Globe zone: sticky, globe rises from below and zooms up ── */}
        <div className="about-globe-zone relative" style={{ height: "180vh" }}>
          <div className="sticky top-0 h-screen overflow-visible">
            {/* Globe — left-biased */}
            <div
              className="about-globe-wrap absolute"
              style={{
                left: "36%",
                top: "47%",
                marginLeft: `${-(GLOBE_SIZE / 2)}px`,
                marginTop: `${-(GLOBE_SIZE / 2)}px`,
                width: GLOBE_SIZE,
                height: GLOBE_SIZE,
              }}
            >
              <RotatingEarth width={GLOBE_SIZE} height={GLOBE_SIZE} markers={CITY_MARKERS} markerOpacityRef={markerOpacityRef} />
            </div>

            {/* Countries panel — shifted left, adjacent to globe */}
            <div
              className="about-countries-panel absolute top-0 h-full flex flex-col justify-center px-10"
              style={{ left: "66%", width: "28%" }}
            >
              <p
                className="font-mono uppercase tracking-[0.3em] text-foreground/40 mb-8"
                style={{ fontSize: "0.65rem" }}
              >
                Global Reach
              </p>

              {/* 30+ and description side by side */}
              <div className="flex items-start gap-6 mb-10">
                <div className="shrink-0">
                  <div
                    className="font-sans font-bold leading-none tracking-tight text-foreground/85"
                    style={{ fontSize: "clamp(3rem, 4.5vw, 5.5rem)" }}
                  >
                    <span ref={counter3Ref}>30</span>
                    <span>+</span>
                  </div>
                  <div className="font-sans text-base font-medium text-foreground/55 mt-2">
                    Countries Served
                  </div>
                  <div className="font-mono text-[0.58rem] uppercase tracking-widest text-foreground/30 mt-1">
                    Worldwide presence
                  </div>
                </div>
                <div className="pt-1 border-l border-foreground/[0.10] pl-6">
                  <p className="font-sans text-sm leading-relaxed text-foreground/45">
                    Active partnerships spanning every major continent and market.
                  </p>
                </div>
              </div>

              {/* Region tags to fill space */}
              <div className="space-y-3">
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.25em] text-foreground/25 mb-4">
                  Key Regions
                </p>
                {[
                  { region: "North America", markets: "US · Canada · Mexico" },
                  { region: "Europe", markets: "UK · Germany · France · Nordics" },
                  { region: "Asia Pacific", markets: "SG · JP · KR · AU · IN" },
                  { region: "Middle East", markets: "UAE · Israel" },
                ].map(({ region, markets }) => (
                  <div
                    key={region}
                    className="flex items-center justify-between rounded-lg px-4 py-2.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="font-sans text-xs font-medium text-foreground/60">{region}</span>
                    <span className="font-mono text-[0.58rem] text-foreground/30 tracking-wide">{markets}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-foreground/[0.08] md:mx-12 lg:mx-16" />

        {/* ── Screen 3: CTA ── */}
        <div className="abt-cta flex min-h-[65vh] flex-col items-center justify-center gap-8 px-6 py-24 text-center md:px-12 md:py-32 lg:px-16">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.3em] text-foreground/40">
            Get in touch
          </p>
          <h2
            className="max-w-4xl font-sans font-bold leading-[1.05] tracking-tight text-foreground"
            style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)" }}
          >
            Ready to get started?
          </h2>
          <p className="max-w-xl font-sans text-base leading-relaxed text-foreground/55 md:text-lg">
            Let's build something great together. Tell us about your project and we'll be in touch within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <MagneticButton size="lg" variant="primary" onClick={() => scrollToSection?.(4)}>
              Get Started
            </MagneticButton>
            <MagneticButton size="lg" variant="secondary" onClick={() => scrollToSection?.(1)}>
              View Case Studies
            </MagneticButton>
          </div>
        </div>
        <SolFooter scrollToSection={scrollToSection} />
      </div>
    </section>
  )
})

AboutSection.displayName = "AboutSection"
