"use client"

import { forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { SolFooter } from "@/components/sections/sol-footer"

type GSAPType = typeof import("gsap").default
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").default

// Expanded sub-services mirroring Lesse Studio's detailed tag structure
const SERVICES = [
  {
    num: "01",
    title: "AI Innovation",
    description:
      "Harness artificial intelligence to transform operations, sharpen decision-making, and build sustainable competitive advantage.",
    tags: [
      "Machine Learning",
      "Predictive Analytics",
      "Process Automation",
      "NLP & Computer Vision",
      "AI Strategy & Roadmap",
      "Model Development & Deployment",
    ],
  },
  {
    num: "02",
    title: "Asset Management",
    description:
      "Comprehensive lifecycle strategies that maximise asset value, minimise risk, and deliver long-term operational efficiency.",
    tags: [
      "Asset Lifecycle Management",
      "Portfolio Optimisation",
      "Risk Assessment",
      "Performance Tracking",
      "Compliance & Reporting",
      "Asset Valuation",
    ],
  },
  {
    num: "03",
    title: "Capital Expenditure",
    description:
      "Strategic capital investment planning that maximises ROI and aligns spending with long-term business objectives.",
    tags: [
      "CapEx Planning & Budgeting",
      "ROI Analysis",
      "Investment Prioritisation",
      "Financial Modelling",
      "Cost-Benefit Analysis",
      "Spend Optimisation",
    ],
  },
  {
    num: "04",
    title: "Digital Transformation",
    description:
      "End-to-end modernisation programs that reimagine processes, platforms, and people for the digital era.",
    tags: [
      "Digital Strategy",
      "Platform Modernisation",
      "Cloud Migration",
      "Process Digitisation",
      "Change Management",
      "Legacy System Integration",
    ],
  },
  {
    num: "05",
    title: "Strategic Marketing",
    description:
      "Data-driven marketing that builds brands, engages the right audiences, and delivers measurable, sustainable growth.",
    tags: [
      "Brand Strategy & Positioning",
      "Campaign Management",
      "Performance Analytics",
      "Growth Marketing",
      "Market Research",
      "Content Strategy",
    ],
  },
  {
    num: "06",
    title: "Technology Consulting",
    description:
      "Expert guidance on technology strategy, architecture, and implementation that drives innovation and operational excellence.",
    tags: [
      "IT Strategy & Roadmap",
      "Architecture Design",
      "Vendor Selection",
      "Implementation Support",
      "Performance Optimisation",
      "Innovation Advisory",
    ],
  },
]

interface ServicesSectionProps {
  isCurrent?: boolean
  scrollToSection?: (index: number) => void
}

export const ServicesSection = forwardRef<
  { scrollToTop: () => void; scrollToBottom: () => void; getScrollElement: () => HTMLDivElement | null },
  ServicesSectionProps
>(({ isCurrent = false, scrollToSection }, ref) => {
  const scrollElRef = useRef<HTMLDivElement>(null)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([])
  const metaRefs = useRef<(HTMLDivElement | null)[]>([])  // number + description
  const tagGroupRefs = useRef<(HTMLDivElement | null)[]>([])
  const triggersRef = useRef<any[]>([])
  const gsapRef = useRef<GSAPType | null>(null)
  const stRef = useRef<ScrollTriggerType | null>(null)

  useImperativeHandle(ref, () => ({
    scrollToTop: () => scrollElRef.current?.scrollTo({ top: 0 }),
    scrollToBottom: () => {
      const el = scrollElRef.current
      if (el) el.scrollTo({ top: el.scrollHeight })
    },
    getScrollElement: () => scrollElRef.current,
  }))

  useEffect(() => {
    const scrollEl = scrollElRef.current

    if (!isCurrent) {
      triggersRef.current.forEach((t) => t.kill())
      triggersRef.current = []
      // Reset animated elements to initial state using cached gsap
      const g = gsapRef.current
      if (g) {
        titleRefs.current.forEach((el) => { if (el) g.set(el, { y: 60, opacity: 0 }) })
        metaRefs.current.forEach((el) => { if (el) g.set(el, { y: 30, opacity: 0 }) })
        tagGroupRefs.current.forEach((el) => {
          if (el) g.set(Array.from(el.children), { y: 18, opacity: 0 })
        })
      }
      return
    }

    if (!scrollEl) return

    let cancelled = false
    let idleHandle: number | ReturnType<typeof setTimeout>

    // Lazy-load GSAP + ScrollTrigger only when this section becomes current
    const init = async () => {
      if (!gsapRef.current) {
        const [{ default: gsap }, { default: ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ])
        gsap.registerPlugin(ScrollTrigger)
        gsapRef.current = gsap
        stRef.current = ScrollTrigger
      }
      if (cancelled) return

      const gsap = gsapRef.current!
      const ScrollTrigger = stRef.current!

      // Set initial states before animating
      titleRefs.current.forEach((el) => { if (el) gsap.set(el, { y: 60, opacity: 0 }) })
      metaRefs.current.forEach((el) => { if (el) gsap.set(el, { y: 30, opacity: 0 }) })
      tagGroupRefs.current.forEach((el) => {
        if (el) gsap.set(Array.from(el.children), { y: 18, opacity: 0 })
      })

      triggersRef.current.forEach((t) => t.kill())
      triggersRef.current = []

      // Defer ScrollTrigger.refresh to idle time to avoid forced reflow on main thread
      const scheduleRefresh = (cb: () => void) => {
        if (typeof requestIdleCallback !== "undefined") {
          idleHandle = requestIdleCallback(cb, { timeout: 500 })
        } else {
          idleHandle = setTimeout(cb, 100)
        }
      }
      scheduleRefresh(() => {
        if (cancelled) return
        ScrollTrigger.refresh()

        blockRefs.current.forEach((block, i) => {
          if (!block) return

          const title = titleRefs.current[i]
          const meta = metaRefs.current[i]
          const tagGroup = tagGroupRefs.current[i]

          // Title — big slide-up reveal (Lesse-style)
          if (title) {
            const st = ScrollTrigger.create({
              trigger: block,
              scroller: scrollEl,
              start: "top 80%",
              onEnter: () => {
                gsap.to(title, {
                  y: 0,
                  opacity: 1,
                  duration: 0.9,
                  ease: "power3.out",
                })
              },
            })
            triggersRef.current.push(st)
          }

          // Number label + description — slightly delayed
          if (meta) {
            const st = ScrollTrigger.create({
              trigger: block,
              scroller: scrollEl,
              start: "top 80%",
              onEnter: () => {
                gsap.to(meta, {
                  y: 0,
                  opacity: 1,
                  duration: 0.7,
                  ease: "power3.out",
                  delay: 0.12,
                })
              },
            })
            triggersRef.current.push(st)
          }

          // Tags — stagger in after title lands (Lesse's stagger pattern)
          if (tagGroup) {
            const tags = Array.from(tagGroup.children)
            const st = ScrollTrigger.create({
              trigger: block,
              scroller: scrollEl,
              start: "top 75%",
              onEnter: () => {
                gsap.to(tags, {
                  y: 0,
                  opacity: 1,
                  duration: 0.5,
                  ease: "power2.out",
                  stagger: 0.05,
                  delay: 0.25,
                })
              },
            })
            triggersRef.current.push(st)
          }
        })
      })
    }

    init()

    return () => {
      cancelled = true
      if (typeof requestIdleCallback !== "undefined" && typeof idleHandle === "number") {
        cancelIdleCallback(idleHandle)
      } else if (idleHandle !== undefined) {
        clearTimeout(idleHandle as ReturnType<typeof setTimeout>)
      }
      triggersRef.current.forEach((t) => t.kill())
      triggersRef.current = []
    }
  }, [isCurrent])

  return (
    <section className="relative h-screen w-screen shrink-0 overflow-hidden flex flex-col">
      {/* Top label — fixed inside section */}
      <div className="shrink-0 px-[10vw] pt-12 pb-0">
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 9.5,
            color: "rgba(255,255,255,0.28)",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            margin: 0,
          }}
        >
          SERVICES
        </p>
      </div>

      {/* Scrollable inner — exposed as getScrollElement so outer wheel handler works */}
      <div
        ref={scrollElRef}
        className="flex-1 overflow-y-auto overflow-x-hidden"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {/* Service blocks */}
        {SERVICES.map((service, i) => (
          <div
            key={i}
            ref={(el) => { blockRefs.current[i] = el }}
            style={{
              position: "relative",
              padding: "52px 10vw 56px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Giant background number — Lesse's signature */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                right: "7vw",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "clamp(9rem, 17vw, 21rem)",
                fontWeight: 900,
                lineHeight: 1,
                color: "rgba(255,255,255,0.028)",
                userSelect: "none",
                pointerEvents: "none",
                letterSpacing: "-0.06em",
                zIndex: 0,
              }}
            >
              {service.num}
            </div>

            {/* Foreground content */}
            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Number label + description — animated as one unit */}
              <div ref={(el) => { metaRefs.current[i] = el }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    marginBottom: 18,
                  }}
                >
                  {service.num} / 06
                </span>
              </div>

              {/* Big title — the dominant typographic element */}
              <h2
                ref={(el) => { titleRefs.current[i] = el }}
                style={{
                  fontSize: "clamp(3rem, 5.5vw, 6rem)",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.90)",
                  margin: "0 0 22px",
                  lineHeight: 1.04,
                  letterSpacing: "-0.04em",
                  maxWidth: "58vw",
                }}
              >
                {service.title}
              </h2>

              {/* Description */}
              <p
                style={{
                  fontSize: "clamp(12px, 1vw, 14px)",
                  color: "rgba(255,255,255,0.36)",
                  maxWidth: 500,
                  lineHeight: 1.8,
                  margin: "0 0 30px",
                  letterSpacing: "0.01em",
                }}
              >
                {service.description}
              </p>

              {/* Tags — flex-wrap list, Lesse pattern */}
              <div
                ref={(el) => { tagGroupRefs.current[i] = el }}
                style={{ display: "flex", flexWrap: "wrap", gap: "7px 9px" }}
              >
                {service.tags.map((tag, j) => (
                  <span
                    key={j}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = "rgba(255,255,255,0.28)"
                      el.style.color = "rgba(255,255,255,0.78)"
                      el.style.transform = "scale(1.02)"
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = "rgba(255,255,255,0.10)"
                      el.style.color = "rgba(255,255,255,0.38)"
                      el.style.transform = "scale(1)"
                    }}
                    style={{
                      display: "inline-block",
                      padding: "5px 14px",
                      borderRadius: 100,
                      border: "1px solid rgba(255,255,255,0.10)",
                      color: "rgba(255,255,255,0.38)",
                      fontSize: 10.5,
                      letterSpacing: "0.05em",
                      fontFamily: "monospace",
                      textTransform: "uppercase",
                      cursor: "default",
                      transition: "all 0.22s ease",
                      userSelect: "none",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Bottom CTA */}
        <div style={{ display: "flex", justifyContent: "center", padding: "64px 0 80px" }}>
          <button
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.10)"
              e.currentTarget.style.transform = "scale(1.04)"
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)"
              e.currentTarget.style.transform = "scale(1)"
            }}
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.13)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.70)",
              padding: "14px 34px",
              borderRadius: 100,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "inherit",
              letterSpacing: "0.03em",
            }}
          >
            Discuss The Project →
          </button>
        </div>
        <SolFooter scrollToSection={scrollToSection} />
      </div>
    </section>
  )
})

ServicesSection.displayName = "ServicesSection"
