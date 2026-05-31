"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    let cleanup = () => {}

    import("gsap").then(({ default: gsap }) => {
      if (!outerRef.current || !innerRef.current) return

      gsap.set([outer, inner], { xPercent: -50, yPercent: -50, x: -200, y: -200 })

      const xTo = gsap.quickTo(outer, "x", { duration: 0.55, ease: "power3.out" })
      const yTo = gsap.quickTo(outer, "y", { duration: 0.55, ease: "power3.out" })
      const xiTo = gsap.quickTo(inner, "x", { duration: 0.08, ease: "none" })
      const yiTo = gsap.quickTo(inner, "y", { duration: 0.08, ease: "none" })

      let isPtr = false

      const handleMouseMove = (e: MouseEvent) => {
        xTo(e.clientX)
        yTo(e.clientY)
        xiTo(e.clientX)
        yiTo(e.clientY)

        const target = e.target as HTMLElement
        const newIsPtr =
          target.tagName === "IFRAME" ||
          target.tagName === "CANVAS" ||
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          !!target.closest('button, a, [role="button"], [data-cursor="pointer"]')

        if (newIsPtr !== isPtr) {
          isPtr = newIsPtr
          gsap.to(outer, { scale: isPtr ? 1.5 : 1, opacity: isPtr ? 0 : 1, duration: 0.2, ease: "power2.out" })
          gsap.to(inner, { scale: isPtr ? 0 : 1, opacity: isPtr ? 0 : 1, duration: 0.2, ease: "power2.out" })
        }
      }

      window.addEventListener("mousemove", handleMouseMove, { passive: true })
      cleanup = () => window.removeEventListener("mousemove", handleMouseMove)
    })

    return () => cleanup()
  }, [])

  return (
    <>
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div className="h-4 w-4 rounded-full border-2 border-white" />
      </div>
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference"
        style={{ willChange: "transform" }}
      >
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>
    </>
  )
}
