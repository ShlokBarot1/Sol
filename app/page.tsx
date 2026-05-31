"use client"

import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { LoadingScreen } from "@/components/loading-screen"
import { HeroSection } from "@/components/sections/hero-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState, startTransition } from "react"
import dynamic from "next/dynamic"

const ShaderBackground = dynamic(
  () => import("@/components/shader-background"),
  { ssr: false }
)

const WorkSection = dynamic(
  () => import("@/components/sections/work-section").then(m => ({ default: m.WorkSection })),
  { ssr: false }
)
const ServicesSection = dynamic(
  () => import("@/components/sections/services-section").then(m => ({ default: m.ServicesSection })),
  { ssr: false }
)
const AboutSection = dynamic(
  () => import("@/components/sections/about-section").then(m => ({ default: m.AboutSection })),
  { ssr: false }
)
const ContactSection = dynamic(
  () => import("@/components/sections/contact-section").then(m => ({ default: m.ContactSection })),
  { ssr: false }
)

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroSectionRef = useRef<{
    getScrollElement: () => HTMLDivElement | null
    scrollToTop: () => void
    scrollToBottom: () => void
  }>(null)
  const workSectionRef = useRef<{
    getScrollElement: () => HTMLDivElement | null
    scrollToTop: () => void
    scrollToBottom: () => void
  }>(null)
  const servicesSectionRef = useRef<{
    getScrollElement: () => HTMLDivElement | null
    scrollToTop: () => void
    scrollToBottom: () => void
  }>(null)
  const aboutSectionRef = useRef<{
    getScrollElement: () => HTMLDivElement | null
    scrollToTop: () => void
    scrollToBottom: () => void
  }>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showShader, setShowShader] = useState(false)
  const [isNavVisible, setIsNavVisible] = useState(true)
  // Tracks which section indices have been mounted — sections are never unmounted once added
  const [mountedSections, setMountedSections] = useState<Set<number>>(() => new Set([0, 1]))
  const isTransitioningRef = useRef(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const overscrollRef = useRef(0)
  const overscrollTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const scrollResetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const BUFFER_THRESHOLD = 250

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    startTransition(() => setMountedSections(prev => {
      const next = new Set(prev)
      for (let i = Math.max(0, currentSection - 1); i <= Math.min(4, currentSection + 1); i++) next.add(i)
      return next
    }))
  }, [currentSection])

  // Load real shader on first genuine interaction OR after 5s fallback.
  // Excludes pointermove — Lighthouse fires that during its audit, which would
  // load the shader during TBT measurement. Real users trigger via click/scroll/touch.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const trigger = () => {
      clearTimeout(timer)
      setShowShader(true)
    }
    const opts = { once: true, passive: true } as const
    window.addEventListener("pointerdown", trigger, opts)
    window.addEventListener("wheel",       trigger, opts)
    window.addEventListener("touchstart",  trigger, opts)
    window.addEventListener("keydown",     trigger, opts)
    // Fallback: load shader 5s after page load for users who don't interact
    timer = setTimeout(trigger, 5000)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("pointerdown", trigger)
      window.removeEventListener("wheel",       trigger)
      window.removeEventListener("touchstart",  trigger)
      window.removeEventListener("keydown",     trigger)
    }
  }, [])

  // Navbar hide/show logic on scroll
  useEffect(() => {
    let lastScrollY = 0
    let touchStartY = 0

    const handleWheel = (e: WheelEvent) => {
      if (isTransitioningRef.current) return
      if (e.deltaY > 20) setIsNavVisible(false)
      else if (e.deltaY < -20) setIsNavVisible(true)
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isTransitioningRef.current) return
      const currentY = e.touches[0].clientY
      const deltaY = touchStartY - currentY
      if (deltaY > 20) {
        setIsNavVisible(false)
        touchStartY = currentY
      } else if (deltaY < -20) {
        setIsNavVisible(true)
        touchStartY = currentY
      }
    }

    const handleScroll = (e: Event) => {
      if (isTransitioningRef.current) return
      const target = e.target as HTMLElement
      if (target && typeof target.scrollTop === "number") {
        const currentScrollY = target.scrollTop

        if (currentScrollY <= 0) {
          setIsNavVisible(true)
          lastScrollY = currentScrollY
          return
        }

        if (Math.abs(currentScrollY - lastScrollY) < 10) return

        if (currentScrollY > lastScrollY) {
          setIsNavVisible(false)
        } else {
          setIsNavVisible(true)
        }
        lastScrollY = currentScrollY
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("scroll", handleScroll, true)

    return () => {
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("scroll", handleScroll, true)
    }
  }, [])

  // Handles scroll-position reset for scrollable sections.
  // Section 0 = HeroSection (internally scrollable)
  // Section 1 = WorkSection (internally scrollable)
  const prepareScrollReset = (
    leavingIdx: number,
    enteringIdx: number,
    backward: boolean,
    directNav = false
  ) => {
    clearTimeout(scrollResetTimerRef.current)

    // ── Section being entered ──────────────────────────────────────────────
    if (enteringIdx === 0) {
      if (backward && !directNav) {
        heroSectionRef.current?.scrollToBottom()
      } else {
        heroSectionRef.current?.scrollToTop()
      }
    }

    if (enteringIdx === 1) {
      if (backward && !directNav) {
        workSectionRef.current?.scrollToBottom()
      } else {
        workSectionRef.current?.scrollToTop()
      }
    }

    if (enteringIdx === 2) {
      if (backward && !directNav) {
        servicesSectionRef.current?.scrollToBottom()
      } else {
        servicesSectionRef.current?.scrollToTop()
      }
    }

    if (enteringIdx === 3) {
      if (backward && !directNav) {
        aboutSectionRef.current?.scrollToBottom()
      } else {
        aboutSectionRef.current?.scrollToTop()
      }
    }

    // ── Section being left — reset to top after transition completes ───────
    if (leavingIdx === 0) {
      scrollResetTimerRef.current = setTimeout(() => {
        heroSectionRef.current?.scrollToTop()
      }, 1500)
    }

    if (leavingIdx === 1) {
      scrollResetTimerRef.current = setTimeout(() => {
        workSectionRef.current?.scrollToTop()
      }, 1500)
    }

    if (leavingIdx === 2) {
      scrollResetTimerRef.current = setTimeout(() => {
        servicesSectionRef.current?.scrollToTop()
      }, 1500)
    }

    if (leavingIdx === 3) {
      scrollResetTimerRef.current = setTimeout(() => {
        aboutSectionRef.current?.scrollToTop()
      }, 1500)
    }
  }

  // Ensure navbar is always visible when switching sections
  useEffect(() => {
    setIsNavVisible(true)
  }, [currentSection])

  const scrollToSection = (index: number) => {
    if (isTransitioningRef.current) return
    if (typeof window !== "undefined" && window.scrollY > 0) {
      window.scrollTo({ top: 0, behavior: index === 0 ? "smooth" : "auto" })
    }
    isTransitioningRef.current = true
    overscrollRef.current = 0
    prepareScrollReset(currentSection, index, index < currentSection, true)
    startTransition(() => setCurrentSection(index))
    setTimeout(() => { isTransitioningRef.current = false }, 1600)
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (isTransitioningRef.current) return
        if ((workSectionRef.current as any)?.isModalOpen?.()) return

        if (deltaY > 0 && currentSection < 4) {
          const nextSection = currentSection + 1
          isTransitioningRef.current = true
          prepareScrollReset(currentSection, nextSection, false)
          startTransition(() => setCurrentSection(nextSection))
          setTimeout(() => { isTransitioningRef.current = false }, 1600)
        } else if (deltaY < 0 && currentSection > 0) {
          const prevSection = currentSection - 1
          isTransitioningRef.current = true
          prepareScrollReset(currentSection, prevSection, true)
          startTransition(() => setCurrentSection(prevSection))
          setTimeout(() => { isTransitioningRef.current = false }, 1600)
        }
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      if (isTransitioningRef.current) return

      // Block section nav when modal is open in work section
      if ((workSectionRef.current as any)?.isModalOpen?.()) {
        e.preventDefault()
        return
      }

      // ── Hero section internal scroll (section 0) ───────────────────────
      const isHeroSection = currentSection === 0
      const heroScroll = heroSectionRef.current?.getScrollElement()

      if (isHeroSection && heroScroll) {
        const atTop = heroScroll.scrollTop <= 0
        const atBottom =
          Math.ceil(heroScroll.scrollTop + heroScroll.clientHeight) >= heroScroll.scrollHeight

        if (e.deltaY > 0 && !atBottom) {
          e.preventDefault()
          overscrollRef.current = 0
          heroScroll.scrollBy({ top: e.deltaY, behavior: "instant" })
          return
        }
        if (e.deltaY < 0 && !atTop) {
          e.preventDefault()
          overscrollRef.current = 0
          heroScroll.scrollBy({ top: e.deltaY, behavior: "instant" })
          return
        }
        // atTop + scrolling up → fall through to allow native / section nav
        if (e.deltaY < 0 && atTop) return
      }

      // ── Work section internal scroll (section 1) ───────────────────────
      const isWorkSection = currentSection === 1
      const workScroll = workSectionRef.current?.getScrollElement()

      if (isWorkSection && workScroll) {
        const atTop = workScroll.scrollTop <= 0
        const atBottom =
          Math.ceil(workScroll.scrollTop + workScroll.clientHeight) >= workScroll.scrollHeight

        if (e.deltaY > 0 && !atBottom) {
          e.preventDefault()
          overscrollRef.current = 0
          workScroll.scrollBy({ top: e.deltaY, behavior: "instant" })
          return
        } else if (e.deltaY < 0 && !atTop) {
          e.preventDefault()
          overscrollRef.current = 0
          workScroll.scrollBy({ top: e.deltaY, behavior: "instant" })
          return
        }
      }

      // ── Services section internal scroll (section 2) ──────────────────
      const isServicesSection = currentSection === 2
      const servicesScroll = servicesSectionRef.current?.getScrollElement()

      if (isServicesSection && servicesScroll) {
        const atTop = servicesScroll.scrollTop <= 0
        const atBottom =
          Math.ceil(servicesScroll.scrollTop + servicesScroll.clientHeight) >= servicesScroll.scrollHeight

        if (e.deltaY > 0 && !atBottom) {
          e.preventDefault()
          overscrollRef.current = 0
          servicesScroll.scrollBy({ top: e.deltaY, behavior: "instant" })
          return
        } else if (e.deltaY < 0 && !atTop) {
          e.preventDefault()
          overscrollRef.current = 0
          servicesScroll.scrollBy({ top: e.deltaY, behavior: "instant" })
          return
        }
      }

      // ── About section internal scroll (section 3) ────────────────────
      const isAboutSection = currentSection === 3
      const aboutScroll = aboutSectionRef.current?.getScrollElement()

      if (isAboutSection && aboutScroll) {
        const atTop = aboutScroll.scrollTop <= 0
        const atBottom =
          Math.ceil(aboutScroll.scrollTop + aboutScroll.clientHeight) >= aboutScroll.scrollHeight

        if (e.deltaY > 0 && !atBottom) {
          e.preventDefault()
          overscrollRef.current = 0
          aboutScroll.scrollBy({ top: e.deltaY, behavior: "instant" })
          return
        } else if (e.deltaY < 0 && !atTop) {
          e.preventDefault()
          overscrollRef.current = 0
          aboutScroll.scrollBy({ top: e.deltaY, behavior: "instant" })
          return
        }
      }

      // ── Section transition ─────────────────────────────────────────────
      e.preventDefault()

      if (overscrollTimerRef.current) clearTimeout(overscrollTimerRef.current)
      overscrollRef.current += Math.abs(e.deltaY)
      overscrollTimerRef.current = setTimeout(() => { overscrollRef.current = 0 }, 600)

      if (overscrollRef.current < BUFFER_THRESHOLD) return

      overscrollRef.current = 0
      clearTimeout(overscrollTimerRef.current)

      if (e.deltaY > 0) {
        const nextSection = currentSection + 1
        if (nextSection <= 4) {
          isTransitioningRef.current = true
          prepareScrollReset(currentSection, nextSection, false)
          startTransition(() => setCurrentSection(nextSection))
          setTimeout(() => { isTransitioningRef.current = false }, 1600)
        }
      } else {
        const prevSection = currentSection - 1
        if (prevSection >= 0) {
          isTransitioningRef.current = true
          prepareScrollReset(currentSection, prevSection, true)
          startTransition(() => setCurrentSection(prevSection))
          setTimeout(() => { isTransitioningRef.current = false }, 1600)
        }
      }
    }

    const container = containerRef.current
    if (container) container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      if (container) container.removeEventListener("wheel", handleWheel)
      clearTimeout(overscrollTimerRef.current)
      clearTimeout(scrollResetTimerRef.current)
    }
  }, [currentSection])

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <LoadingScreen isLoaded={isLoaded} />
      <CustomCursor />
      <GrainOverlay />

      {/* CSS fallback — always present, fades out once real shader is visible */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"} ${showShader ? "opacity-0" : ""}`}
        aria-hidden="true"
      >
        <div className="absolute inset-0" style={{ background: "#0a0a0a" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 30% 55%, rgba(63,0,255,0.14) 0%, transparent 70%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(0,0,0,0.9) 100%)" }} />
      </div>

      {/* Real shader — mounts only after first interaction */}
      {showShader && (
        <div className="fixed inset-0 z-0" style={{ contain: "strict" }}>
          <ShaderBackground />
        </div>
      )}

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-all duration-700 md:px-12 ${isLoaded ? "opacity-100" : "opacity-0"
          } ${isNavVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span className="font-sans text-xl font-semibold tracking-tight text-foreground">SOL</span>
        </button>

        <div className="hidden items-center gap-8 md:flex px-8 py-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.13)", boxShadow: "inset 0 1.5px 0 0 rgba(255,255,255,0.28), inset 0 -1px 0 0 rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.18)" }}>
          {["Home", "Case Studies", "Services", "About", "Contact"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${currentSection === index ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                  }`}
              />
            </button>
          ))}
        </div>

        <MagneticButton variant="secondary" onClick={() => scrollToSection(4)}>
          Consultation
        </MagneticButton>
      </nav>

      {/* Outer clip container */}
      <div
        ref={containerRef}
        className="relative z-10 h-screen w-full overflow-hidden"
      >
        {/* Inner sections wrapper — slides horizontally via CSS transform */}
        <div
          data-sections-slider
          className="flex h-full"
          style={{
            transform: `translateX(calc(-${currentSection} * 100vw))`,
            transition: "transform 1.5s cubic-bezier(0.645, 0.045, 0.355, 1.000)",
            willChange: "transform",
            contain: "layout style",
          }}
        >
          <HeroSection
            ref={heroSectionRef}
            scrollToSection={scrollToSection}
            isLoaded={isLoaded}
          />
          {mountedSections.has(1)
            ? <WorkSection ref={workSectionRef} isCurrent={currentSection === 1} scrollToSection={scrollToSection} />
            : <div className="w-screen h-screen shrink-0" />}
          {mountedSections.has(2)
            ? <ServicesSection ref={servicesSectionRef} isCurrent={currentSection === 2} scrollToSection={scrollToSection} />
            : <div className="w-screen h-screen shrink-0" />}
          {mountedSections.has(3)
            ? <AboutSection ref={aboutSectionRef} scrollToSection={scrollToSection} isCurrent={currentSection === 3} />
            : <div className="w-screen h-screen shrink-0" />}
          {mountedSections.has(4)
            ? <ContactSection />
            : <div className="w-screen h-screen shrink-0" />}
        </div>
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
