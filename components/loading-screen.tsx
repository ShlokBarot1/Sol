"use client"

import { useEffect, useRef, useState } from "react"

interface LoadingScreenProps {
  isLoaded: boolean
}

export function LoadingScreen({ isLoaded }: LoadingScreenProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const [hidden, setHidden] = useState(false)
  const [loadComplete, setLoadComplete] = useState(false)

  // Entrance: CSS handles bar fill — no GSAP during critical boot
  // Logo/tagline fade use CSS animation too for zero JS cost
  useEffect(() => {
    // Mark load complete after a short delay so the bar CSS animation has room
    const id = setTimeout(() => setLoadComplete(isLoaded), isLoaded ? 0 : 50)
    return () => clearTimeout(id)
  }, [isLoaded])

  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768)
  }, [])

  // Exit animation once loaded — GSAP fires after assets ready, loaded lazily to avoid blocking initial render
  useEffect(() => {
    if (!isLoaded) return
    
    if (isDesktop) {
      let tl: any
      import("gsap").then(({ default: gsap }) => {
        tl = gsap.timeline({
          delay: 0.3,
          onComplete: () => setHidden(true),
        })
        tl.to([logoRef.current, taglineRef.current, barRef.current], {
          y: -16, opacity: 0, duration: 0.45, ease: "power2.in", stagger: 0.04,
        })
        tl.to(overlayRef.current, { opacity: 0, duration: 0.55, ease: "power2.inOut" }, "-=0.1")
      })
      return () => { tl?.kill() }
    } else {
      // Reduced from 1100ms — shorter exit keeps LCP element visible sooner on mobile
      const id = setTimeout(() => setHidden(true), 500)
      return () => clearTimeout(id)
    }
  }, [isLoaded, isDesktop])

  if (hidden) return null

  return (
    <>
      <style>{`
        @keyframes sol-fadein {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sol-bar-fill {
          0%   { width: 0%; }
          60%  { width: 68%; }
          100% { width: 68%; }
        }
        @keyframes sol-bar-complete {
          from { width: 68%; }
          to   { width: 100%; }
        }
        .sol-logo    { animation: sol-fadein 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
        .sol-tagline { animation: sol-fadein 0.6s cubic-bezier(0.16,1,0.3,1) 0.25s both; }
        .sol-bar     { animation: sol-fadein 0.4s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .sol-bar-fill { animation: sol-bar-fill 1.4s cubic-bezier(0.4,0,0.2,1) 0.4s both; }
        .sol-bar-fill.complete { animation: sol-bar-complete 0.3s cubic-bezier(0.4,0,1,1) both; }

        .sol-exiting { animation: sol-overlay-fadeout 0.55s cubic-bezier(0.4,0,0.2,1) 0.5s both; }
        .sol-exiting .sol-logo { animation: sol-fadeout 0.45s cubic-bezier(0.4,0,1,1) 0.3s both; }
        .sol-exiting .sol-tagline { animation: sol-fadeout 0.45s cubic-bezier(0.4,0,1,1) 0.34s both; }
        .sol-exiting .sol-bar { animation: sol-fadeout 0.45s cubic-bezier(0.4,0,1,1) 0.38s both; }
        @media (max-width: 767px) {
          .sol-exiting { animation: sol-overlay-fadeout 0.3s cubic-bezier(0.4,0,0.2,1) 0.12s both; }
          .sol-exiting .sol-logo { animation: sol-fadeout 0.18s cubic-bezier(0.4,0,1,1) 0.04s both; }
          .sol-exiting .sol-tagline { animation: sol-fadeout 0.18s cubic-bezier(0.4,0,1,1) 0.06s both; }
          .sol-exiting .sol-bar { animation: sol-fadeout 0.18s cubic-bezier(0.4,0,1,1) 0.08s both; }
        }
        @keyframes sol-fadeout {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-16px); }
        }
        @keyframes sol-overlay-fadeout {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
      `}</style>

      <div
        ref={overlayRef}
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center${!isDesktop && isLoaded ? " sol-exiting" : ""}`}
        style={{ background: "oklch(0.12 0 0)" }}
      >
        {/* Radial glow — pure CSS, zero JS */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: 480,
            height: 480,
            background: "radial-gradient(ellipse at center, rgba(63,0,255,0.12) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Logo */}
        <div ref={logoRef} className="sol-logo relative z-10 text-center">
          <span
            className="font-sans font-semibold tracking-tight text-foreground"
            style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", letterSpacing: "-0.04em" }}
          >
            SOL
          </span>
        </div>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="sol-tagline relative z-10 mt-3 font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/30"
        >
          Advisers
        </p>

        {/* Progress bar */}
        <div
          ref={barRef}
          className="sol-bar relative z-10 mt-12 overflow-hidden rounded-full"
          style={{ width: 120, height: 1, background: "rgba(255,255,255,0.08)" }}
        >
          <div
            className={`sol-bar-fill absolute left-0 top-0 h-full rounded-full${loadComplete ? " complete" : ""}`}
            style={{ background: "rgba(255,255,255,0.55)" }}
          />
        </div>
      </div>
    </>
  )
}
