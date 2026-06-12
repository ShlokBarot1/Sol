"use client"

import { useEffect, useRef } from "react"

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // No cursor on touch/mobile — skip GSAP load entirely
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return

    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    let cleanup = () => {}
    let started = false

    // Defer the GSAP load until the user actually moves the mouse. The cursor is
    // useless before the first move anyway, and this keeps GSAP's parse/eval out
    // of the initial load (and out of the Lighthouse TBT window, which never
    // moves the pointer). The first real position is replayed once GSAP is ready.
    const onFirstMove = (firstEvent: MouseEvent) => {
      if (started) return
      started = true
      window.removeEventListener("mousemove", onFirstMove)

      import("gsap").then(({ default: gsap }) => {
        if (!outerRef.current || !innerRef.current) return

        gsap.set([outer, inner], { xPercent: -50, yPercent: -50, x: firstEvent.clientX, y: firstEvent.clientY })

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

      handleMouseMove(firstEvent)
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
      cleanup = () => window.removeEventListener("mousemove", handleMouseMove)
      })
    }

    window.addEventListener("mousemove", onFirstMove, { passive: true })
    cleanup = () => window.removeEventListener("mousemove", onFirstMove)

    return () => cleanup()
  }, [])

  return (
    <>
      <div
        ref={outerRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference hidden md:block"
        style={{ willChange: "transform" }}
      >
        <div className="h-4 w-4 rounded-full border-2 border-white" />
      </div>
      <div
        ref={innerRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] mix-blend-difference hidden md:block"
        style={{ willChange: "transform" }}
      >
        <div className="h-2 w-2 rounded-full bg-white" />
      </div>
    </>
  )
}
