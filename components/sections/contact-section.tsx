"use client"

import { useState, useEffect, useRef } from "react"
import { Mail, MapPin, Phone, Calendar, Loader2, CheckCircle2 } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  projectDescription: string
}

const inputBase: React.CSSProperties = {
  width: "100%",
  height: "45px",
  padding: "0 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "12px",
  color: "rgba(255,255,255,0.9)",
  fontSize: "16px",
  fontFamily: "inherit",
  letterSpacing: "-0.01em",
  outline: "none",
  transition: "border-color 0.18s, box-shadow 0.18s",
  boxSizing: "border-box",
}

const labelSt: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.32)",
  marginBottom: "5px",
}

const fi = (el: HTMLElement) => {
  el.style.borderColor = "rgba(101,90,255,0.55)"
  el.style.boxShadow = "0 0 0 1px rgba(101,90,255,0.18)"
}
const fo = (el: HTMLElement) => {
  el.style.borderColor = "rgba(255,255,255,0.09)"
  el.style.boxShadow = "none"
}

export function ContactSection() {
  const { ref, isVisible } = useReveal(0.15)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "",
    phone: "", companyName: "", projectDescription: "",
  })

  const set = (k: keyof FormData) => (v: string) =>
    setForm(p => ({ ...p, [k]: v }))

  // Prevent page-level scroll interception
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      const atTop = el.scrollTop <= 0
      if (e.deltaY < 0 && atTop) return
      e.stopPropagation()
    }
    el.addEventListener("wheel", onWheel)
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  const openCalendly = () => {
    const base = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/soladvisers/consultation"
    const qs = new URLSearchParams({
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
    })
    const url = `${base}?${qs.toString()}`
    if (typeof window !== "undefined" && (window as any).Calendly) {
      ;(window as any).Calendly.initPopupWidget({ url })
      return
    }
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    script.onload = () => (window as any).Calendly?.initPopupWidget({ url })
    document.head.appendChild(script)
    if (!document.getElementById("calendly-css")) {
      const link = document.createElement("link")
      link.id = "calendly-css"; link.rel = "stylesheet"
      link.href = "https://assets.calendly.com/assets/external/widget.css"
      document.head.appendChild(link)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting || submitted) return
    if (!form.firstName || !form.lastName || !form.email || !form.companyName) return
    setIsSubmitting(true)
    try {
      await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
      openCalendly()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = form.firstName && form.lastName && form.email && form.companyName

  return (
    <section
      ref={ref}
      className="h-screen w-screen shrink-0 flex overflow-hidden"
    >
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex flex-col justify-center flex-shrink-0"
        style={{
          width: "40%",
          padding: "96px 48px 48px 64px",
          transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.8s",
          transform: isVisible ? "translateX(0)" : "translateX(-40px)",
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div style={{ marginBottom: 52 }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "11px",
            letterSpacing: "0.18em", color: "rgba(255,255,255,0.32)",
            textTransform: "uppercase", marginBottom: "20px",
          }}>
            / Consultation
          </p>
          <h2 style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(3rem, 5vw, 5.5rem)",
            fontWeight: 300, lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.93)", margin: 0,
          }}>
            Schedule a<br />
            <span style={{ position: "relative", display: "inline-block" }}>
              consultation
              <span style={{
                position: "absolute", bottom: -2, left: 0,
                height: "1px", width: "100%",
                background: "linear-gradient(90deg, rgba(101,90,255,0.65), transparent)",
              }} />
            </span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <ContactDetail icon={<Mail style={{ width: 12, height: 12 }} />} label="Email" href="mailto:contact@soladvisers.com">
            contact@soladvisers.com
          </ContactDetail>
          <ContactDetail icon={<Phone style={{ width: 12, height: 12 }} />} label="Phone" href="tel:7739166024">
            (773) 916-6024
          </ContactDetail>
          <ContactDetail icon={<MapPin style={{ width: 12, height: 12 }} />} label="Location">
            360 Central Ave, Suite 800<br />St. Petersburg, FL 33701
          </ContactDetail>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto flex flex-col lg:flex-row items-center lg:items-center lg:justify-start px-4 sm:px-6 lg:pl-8 lg:pr-12 pt-20 pb-32 lg:pt-24 lg:pb-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {/* Mobile header */}
        <div className="block lg:hidden w-full mb-5">
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "12px" }}>
            / Consultation
          </p>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(1.8rem,7vw,2.8rem)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.93)", marginBottom: "16px" }}>
            Schedule a consultation
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <a href="mailto:contact@soladvisers.com" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>contact@soladvisers.com</a>
            <a href="tel:7739166024" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>(773) 916-6024</a>
          </div>
        </div>

        {/* Glass card */}
        <div
          className="w-full lg:max-w-5xl"
          style={{
            transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1) 80ms, opacity 0.8s 80ms",
            transform: isVisible ? "translateY(0)" : "translateY(28px)",
            opacity: isVisible ? 1 : 0,
          }}
        >
          <div
            className="sol-card"
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.055)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: "24px",
              boxShadow: [
                "inset 0 1.5px 0 rgba(255,255,255,0.28)",
                "inset 0 -1px 0 rgba(0,0,0,0.08)",
                "inset 1px 0 0 rgba(255,255,255,0.07)",
                "inset -1px 0 0 rgba(255,255,255,0.07)",
                "0 24px 64px rgba(0,0,0,0.35)",
                "0 4px 16px rgba(0,0,0,0.18)",
              ].join(", "),
              overflow: "hidden",
            }}
          >
            {/* Top specular sheen */}
            <div style={{
              position: "absolute", inset: "0 8% auto", height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.48) 40%, rgba(255,255,255,0.48) 60%, transparent)",
              pointerEvents: "none",
            }} />
            {/* Corner scatter */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none",
              background: "linear-gradient(135deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 35%, transparent 65%)",
            }} />

            <style>{`
              .sol-input::placeholder { color: rgba(255,255,255,0.18) !important; }
              .sol-card { padding: 20px 18px; }
              @media (min-width: 640px) { .sol-card { padding: 24px 28px; } }
            `}</style>
            <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Header */}
              <div style={{ marginBottom: 0 }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.22em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: "6px" }}>
                  Tell us about yourself
                </p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>
                  Luck runs out. Strategy doesn&rsquo;t. Let&rsquo;s build yours.
                </p>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={labelSt}>First Name *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => set("firstName")(e.target.value)}
                    className="sol-input"
                    style={inputBase}
                    onFocus={e => fi(e.target)}
                    onBlur={e => fo(e.target)}
                  />
                </div>
                <div>
                  <label style={labelSt}>Last Name *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => set("lastName")(e.target.value)}
                    className="sol-input"
                    style={inputBase}
                    onFocus={e => fi(e.target)}
                    onBlur={e => fo(e.target)}
                  />
                </div>
              </div>

              {/* Email + Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label style={labelSt}>Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set("email")(e.target.value)}
                    className="sol-input"
                    style={inputBase}
                    onFocus={e => fi(e.target)}
                    onBlur={e => fo(e.target)}
                  />
                </div>
                <div>
                  <label style={labelSt}>Phone <span style={{ color: "rgba(255,255,255,0.18)" }}>(optional)</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set("phone")(e.target.value)}
                    className="sol-input"
                    style={inputBase}
                    onFocus={e => fi(e.target)}
                    onBlur={e => fo(e.target)}
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label style={labelSt}>Company Name *</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={e => set("companyName")(e.target.value)}
                  className="sol-input"
                  style={inputBase}
                  onFocus={e => fi(e.target)}
                  onBlur={e => fo(e.target)}
                />
              </div>

              {/* Project description */}
              <div>
                <label style={labelSt}>What do you need help with? <span style={{ color: "rgba(255,255,255,0.18)" }}>(optional)</span></label>
                <textarea
                  value={form.projectDescription}
                  onChange={e => set("projectDescription")(e.target.value)}
                  className="sol-input"
                  rows={3}
                  style={{
                    ...inputBase,
                    height: "auto",
                    padding: "12px 16px",
                    resize: "none",
                    lineHeight: "1.65",
                  }}
                  onFocus={e => fi(e.target)}
                  onBlur={e => fo(e.target)}
                />
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0 -4px" }} />

              {/* What's included */}
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.32)", lineHeight: 1.4, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
                Free 30-min strategy call
              </span>
              </div>

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || submitted || !canSubmit}
                style={{
                  width: "100%",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "9px",
                  background: submitted
                    ? "rgba(60,180,100,0.14)"
                    : !canSubmit
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(255,255,255,0.08)",
                  border: submitted
                    ? "1px solid rgba(100,220,150,0.25)"
                    : !canSubmit
                    ? "1px solid rgba(255,255,255,0.07)"
                    : "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "14px",
                  color: !canSubmit ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.90)",
                  fontSize: "16px",
                  fontWeight: 500,
                  fontFamily: "inherit",
                  letterSpacing: "-0.01em",
                  cursor: isSubmitting || submitted || !canSubmit ? "default" : "pointer",
                  transition: "all 0.22s",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  boxShadow: submitted || !canSubmit
                    ? "none"
                    : "inset 0 1.5px 0 rgba(255,255,255,0.16), 0 4px 24px rgba(0,0,0,0.22)",
                }}
                onMouseEnter={e => {
                  if (!canSubmit || submitted || isSubmitting) return
                  const b = e.currentTarget
                  b.style.background = "rgba(255,255,255,0.12)"
                  b.style.borderColor = "rgba(255,255,255,0.26)"
                }}
                onMouseLeave={e => {
                  if (!canSubmit || submitted || isSubmitting) return
                  const b = e.currentTarget
                  b.style.background = "rgba(255,255,255,0.08)"
                  b.style.borderColor = "rgba(255,255,255,0.18)"
                }}
              >
                {submitted ? (
                  <><CheckCircle2 style={{ width: 16, height: 16, color: "rgba(100,220,150,0.9)" }} />Submitted — Opening Calendly</>
                ) : isSubmitting ? (
                  <><Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />Submitting…</>
                ) : (
                  <><Calendar style={{ width: 16, height: 16 }} />Book Free Consultation</>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── ContactDetail helper ─────────────────────────────────────────────────────
function ContactDetail({ icon, label, href, children }: {
  icon: React.ReactNode; label: string; href?: string; children: React.ReactNode
}) {
  const inner = (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <span style={{ color: "rgba(255,255,255,0.3)" }}>{icon}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>
          {label}
        </span>
      </div>
      <span style={{ fontSize: "15px", color: "rgba(255,255,255,0.62)", lineHeight: 1.65, transition: "color 0.18s" }}>
        {children}
      </span>
    </>
  )

  if (href) return (
    <a href={href} style={{ display: "block" }}
      onMouseEnter={e => {
        const s = e.currentTarget.querySelector("span:last-child") as HTMLElement
        if (s) s.style.color = "rgba(255,255,255,0.9)"
      }}
      onMouseLeave={e => {
        const s = e.currentTarget.querySelector("span:last-child") as HTMLElement
        if (s) s.style.color = "rgba(255,255,255,0.62)"
      }}
    >
      {inner}
    </a>
  )

  return <div>{inner}</div>
}
