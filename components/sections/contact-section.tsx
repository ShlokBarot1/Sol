"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Mail, MapPin, Phone, Calendar, Loader2, ChevronDown, CheckCircle2 } from "lucide-react"
import { useReveal } from "@/hooks/use-reveal"

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = {
  firstName: string; lastName: string; email: string; phone: string
  companyName: string; role: string; companySize: string; industry: string
  projectDescription: string; budgetRange: string; projectTimeline: string
  preferredDate: string; preferredTime: string
}

// ─── Options ──────────────────────────────────────────────────────────────────
const COMPANY_SIZES = [
  "1-10 employees", "11-50 employees", "51-200 employees",
  "201-500 employees", "500+ employees",
]
const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Manufacturing",
  "Retail", "Education", "Energy", "Transportation",
  "Real Estate", "Other",
]
const BUDGETS = [
  "Under $50,000", "$50,000 – $100,000", "$100,000 – $250,000",
  "$250,000 – $500,000", "$500,000+",
]
const TIMELINES = [
  "ASAP (0-1 month)", "1-3 months", "3-6 months", "6-12 months", "12+ months",
]
const TIME_SLOTS = [
  "9:00 AM EST", "10:00 AM EST", "11:00 AM EST",
  "1:00 PM EST", "2:00 PM EST", "3:00 PM EST", "4:00 PM EST",
]

// ─── Design tokens ────────────────────────────────────────────────────────────
const glassCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "14px",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.28)",
}

const labelSt: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono)",
  fontSize: "9px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
  marginBottom: "6px",
}

const inputBase: React.CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: "10px",
  color: "rgba(255,255,255,0.9)",
  fontSize: "13px",
  fontFamily: "inherit",
  letterSpacing: "-0.01em",
  outline: "none",
  transition: "border-color 0.18s, box-shadow 0.18s",
}

const fi = (el: HTMLElement) => {
  el.style.borderColor = "rgba(101,90,255,0.5)"
  el.style.boxShadow = "0 0 0 1px rgba(101,90,255,0.18)"
}
const fo = (el: HTMLElement) => {
  el.style.borderColor = "rgba(255,255,255,0.09)"
  el.style.boxShadow = "none"
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({ lbl, type = "text", value, onChange, placeholder }: {
  lbl: string; type?: string; value: string
  onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label style={labelSt}>{lbl}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ ...inputBase }}
        onFocus={e => fi(e.target)}
        onBlur={e => fo(e.target)}
      />
    </div>
  )
}

// ─── CustomSelect — portal at document.body, glass design, staggered items ────
function CustomSelect({ lbl, value, onChange, options, placeholder }: {
  lbl: string; value: string; onChange: (v: string) => void
  options: string[]; placeholder: string
}) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [trigRect, setTrigRect] = useState<DOMRect | null>(null)
  const [flipUp, setFlipUp] = useState(false)
  const trigRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const openMenu = () => {
    if (!trigRef.current) return
    const rect = trigRef.current.getBoundingClientRect()
    // estimate panel height: ~43px per item
    const estimatedH = options.length * 43
    const spaceBelow = window.innerHeight - rect.bottom
    setFlipUp(spaceBelow < estimatedH + 16)
    setTrigRect(rect)
    setOpen(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }

  const closeMenu = () => {
    setVisible(false)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (
        !trigRef.current?.contains(e.target as Node) &&
        !panelRef.current?.contains(e.target as Node)
      ) closeMenu()
    }
    const onScroll = () => closeMenu()
    document.addEventListener("mousedown", onDown)
    window.addEventListener("scroll", onScroll, true)
    return () => {
      document.removeEventListener("mousedown", onDown)
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [open])

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    left: trigRect?.left ?? 0,
    width: trigRect?.width ?? 0,
    zIndex: 9999,
    background: "rgba(10,9,20,0.72)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: flipUp ? "12px 12px 0 0" : "0 0 12px 12px",
    boxShadow: [
      "inset 1px 0 0 rgba(255,255,255,0.08)",
      "inset -1px 0 0 rgba(255,255,255,0.08)",
      flipUp
        ? "inset 0 1px 0 rgba(255,255,255,0.08)"
        : "inset 0 -1px 0 rgba(255,255,255,0.08)",
      "0 32px 64px rgba(0,0,0,0.55)",
    ].join(", "),
    overflow: "hidden",
    // position above or below trigger
    ...(flipUp
      ? { bottom: trigRect ? window.innerHeight - trigRect.top : 0, top: "auto" }
      : { top: trigRect?.bottom ?? 0 }),
  }

  // items animate from the opening edge: downward when flipped up, upward when normal
  const itemInitialY = flipUp ? "5px" : "-5px"

  const panel = open && mounted && trigRect
    ? createPortal(
        <div ref={panelRef} style={panelStyle}>
          {options.map((o, i) => (
            <button
              key={o}
              type="button"
              onClick={() => { onChange(o); closeMenu() }}
              style={{
                width: "100%",
                display: "block",
                padding: "11px 14px",
                textAlign: "left",
                background: "transparent",
                border: "none",
                borderBottom: i < options.length - 1
                  ? "1px solid rgba(255,255,255,0.055)"
                  : "none",
                color: o === value ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.50)",
                fontSize: "13px",
                fontFamily: "inherit",
                letterSpacing: "-0.01em",
                cursor: "pointer",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : `translateY(${itemInitialY})`,
                transition: `opacity 0.20s ease ${i * 26}ms, transform 0.20s ease ${i * 26}ms, color 0.12s, background 0.12s`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = "rgba(255,255,255,0.90)"
                el.style.background = "rgba(255,255,255,0.06)"
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.color = o === value ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.50)"
                el.style.background = "transparent"
              }}
            >
              {o}
            </button>
          ))}
        </div>,
        document.body
      )
    : null

  const triggerRadius = open
    ? (flipUp ? "0 0 10px 10px" : "10px 10px 0 0")
    : "10px"
  const triggerBorderEdge = open ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.09)"

  return (
    <div>
      <label style={labelSt}>{lbl}</label>
      <button
        ref={trigRef}
        type="button"
        onClick={open ? closeMenu : openMenu}
        style={{
          width: "100%", height: "44px", padding: "0 14px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderTopColor: open && flipUp ? triggerBorderEdge : "rgba(255,255,255,0.09)",
          borderBottomColor: open && !flipUp ? triggerBorderEdge : "rgba(255,255,255,0.09)",
          borderRadius: triggerRadius,
          color: value ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.32)",
          fontSize: "13px", fontFamily: "inherit", letterSpacing: "-0.01em",
          cursor: "pointer", outline: "none",
          transition: "border-radius 0.22s ease, border-color 0.22s ease",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <ChevronDown style={{
          width: 11, height: 11, flexShrink: 0, marginLeft: 8,
          color: "rgba(255,255,255,0.28)",
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.24s ease",
        }} />
      </button>
      {panel}
    </div>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ num, title, children }: {
  num: string; title: string; children: React.ReactNode
}) {
  return (
    <div style={{ ...glassCard, padding: "20px 24px 24px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "10px",
          letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", userSelect: "none",
        }}>
          {num}
        </span>
        <div style={{ width: 1, height: 11, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: "13px", fontWeight: 500,
          letterSpacing: "-0.015em", color: "rgba(255,255,255,0.78)",
        }}>
          {title}
        </span>
      </div>
      <div style={{ height: 1, background: "rgba(255,255,255,0.055)", marginBottom: 18, marginLeft: -24, marginRight: -24 }} />
      {children}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ContactSection() {
  const { ref, isVisible } = useReveal(0.15)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    companyName: "", role: "", companySize: "", industry: "",
    projectDescription: "", budgetRange: "", projectTimeline: "",
    preferredDate: "", preferredTime: "",
  })

  const set = (k: keyof FormData) => (v: string) => setForm(p => ({ ...p, [k]: v }))

  // Computed client-side only — avoids server/client timezone mismatch (hydration error)
  const [minDate, setMinDate] = useState("")
  useEffect(() => { setMinDate(new Date().toISOString().split("T")[0]) }, [])

  // Native wheel listener fires before the page-level containerRef handler in the
  // bubble chain. stopPropagation() here prevents page.tsx from calling
  // preventDefault() which would block the div from scrolling.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      const atTop = el.scrollTop <= 0
      // At top + scrolling up → let propagate so user can navigate back to section 3
      if (e.deltaY < 0 && atTop) return
      e.stopPropagation()
    }
    el.addEventListener("wheel", onWheel)
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  const handleSubmit = async () => {
    if (isSubmitting || submitted) return
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

  useEffect(() => {
    const onMsg = async (e: MessageEvent) => {
      if (e.data?.event !== "calendly.event_scheduled") return
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            name: `${form.firstName} ${form.lastName}`.trim(),
          }),
        })
        const { url } = await res.json()
        if (url) window.location.href = url
      } catch {}
    }
    window.addEventListener("message", onMsg)
    return () => window.removeEventListener("message", onMsg)
  }, [form.email, form.firstName, form.lastName])

  const col2 = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" } as const

  return (
    <section
      ref={ref}
      className="h-screen w-screen shrink-0 snap-start flex overflow-hidden"
    >
      {/* ── Left panel ──────────────────────────────────────────────────────── */}
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
        {/* Heading */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            color: "rgba(255,255,255,0.32)",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}>
            / Consultation
          </p>
          <h2 style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(3rem, 5vw, 5.5rem)",
            fontWeight: 300,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: "rgba(255,255,255,0.93)",
            margin: 0,
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

        {/* Contact details */}
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

      {/* ── Right panel — scrollable form ─────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{
          padding: "0 0 120px 0",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          scrollbarWidth: "none",
          transition: "transform 0.8s cubic-bezier(0.4,0,0.2,1) 80ms, opacity 0.8s 80ms",
          transform: isVisible ? "translateY(0)" : "translateY(28px)",
          opacity: isVisible ? 1 : 0,
        } as React.CSSProperties}
      >

        {/* ── Mobile header — visible when left panel is hidden ── */}
        <div className="block lg:hidden px-6 pt-10 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "16px" }}>
            / Consultation
          </p>
          <h2 style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(1.8rem,7vw,2.8rem)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.93)", marginBottom: "20px" }}>
            Schedule a<br />consultation
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a href="mailto:contact@soladvisers.com" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
              contact@soladvisers.com
            </a>
            <a href="tel:7739166024" style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>
              (773) 916-6024
            </a>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em" }}>
              360 Central Ave, St. Petersburg FL
            </span>
          </div>
        </div>

        {/* Form content wrapper — adds horizontal padding */}
        <div className="px-5 lg:px-12" style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "88px" }}>

        {/* 01 — Personal Information */}
        <Section num="01" title="Personal Information">
          <div style={col2}>
            <Field lbl="First Name" value={form.firstName} onChange={set("firstName")} placeholder="John" />
            <Field lbl="Last Name" value={form.lastName} onChange={set("lastName")} placeholder="Smith" />
            <Field lbl="Email Address" type="email" value={form.email} onChange={set("email")} placeholder="john@company.com" />
            <Field lbl="Phone Number" type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" />
          </div>
        </Section>

        {/* 02 — Company Information */}
        <Section num="02" title="Company Information">
          <div style={col2}>
            <Field lbl="Company Name" value={form.companyName} onChange={set("companyName")} placeholder="Acme Corporation" />
            <Field lbl="Your Role" value={form.role} onChange={set("role")} placeholder="CEO / Director / Manager" />
            <CustomSelect lbl="Company Size" value={form.companySize} onChange={set("companySize")} options={COMPANY_SIZES} placeholder="Select company size" />
            <CustomSelect lbl="Industry" value={form.industry} onChange={set("industry")} options={INDUSTRIES} placeholder="Select industry" />
          </div>
        </Section>

        {/* 03 — Project Details */}
        <Section num="03" title="Project Details">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={labelSt}>Project Description</label>
              <textarea
                value={form.projectDescription}
                onChange={e => set("projectDescription")(e.target.value)}
                placeholder="Please describe your project and objectives..."
                rows={3}
                style={{ ...inputBase, height: "auto", padding: "12px 14px", resize: "none", lineHeight: "1.65" }}
                onFocus={e => fi(e.target)}
                onBlur={e => fo(e.target)}
              />
            </div>
            <div style={col2}>
              <CustomSelect lbl="Budget Range" value={form.budgetRange} onChange={set("budgetRange")} options={BUDGETS} placeholder="Select budget" />
              <CustomSelect lbl="Project Timeline" value={form.projectTimeline} onChange={set("projectTimeline")} options={TIMELINES} placeholder="Select timeline" />
            </div>
          </div>
        </Section>

        {/* 04 — Schedule Consultation */}
        <Section num="04" title="Schedule Consultation">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={col2}>
              <div>
                <label style={labelSt}>Preferred Date</label>
                <input
                  type="date"
                  value={form.preferredDate}
                  onChange={e => set("preferredDate")(e.target.value)}
                  min={minDate}
                  style={{
                    ...inputBase,
                    colorScheme: "dark",
                    color: form.preferredDate ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                  } as React.CSSProperties}
                  onFocus={e => fi(e.target)}
                  onBlur={e => fo(e.target)}
                />
              </div>
              <CustomSelect
                lbl="Preferred Time (EST)"
                value={form.preferredTime}
                onChange={set("preferredTime")}
                options={TIME_SLOTS}
                placeholder="Select time slot"
              />
            </div>

            {/* What's included */}
            <div style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "14px 16px",
            }}>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "8px",
                letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase", marginBottom: "10px",
              }}>
                What&apos;s Included
              </p>
              {["60-minute strategy session", "Custom roadmap & deliverables", "30-day follow-up support"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 3, height: 3, borderRadius: "50%", background: "oklch(0.68 0.18 45)", flexShrink: 0 }} />
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || submitted}
              style={{
                width: "100%", height: "52px",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: submitted
                  ? "rgba(60,180,100,0.14)"
                  : isSubmitting
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.07)",
                border: submitted
                  ? "1px solid rgba(100,220,150,0.25)"
                  : isSubmitting
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(255,255,255,0.16)",
                borderRadius: "12px",
                color: "rgba(255,255,255,0.88)",
                fontSize: "14px", fontWeight: 500, fontFamily: "inherit",
                letterSpacing: "-0.01em",
                cursor: isSubmitting || submitted ? "default" : "pointer",
                transition: "all 0.22s",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                boxShadow: submitted || isSubmitting
                  ? "none"
                  : "inset 0 1.5px 0 rgba(255,255,255,0.14), 0 4px 24px rgba(0,0,0,0.22)",
              }}
            >
              {submitted ? (
                <><CheckCircle2 style={{ width: 15, height: 15, color: "rgba(100,220,150,0.9)" }} />Submitted — Check Your Email</>
              ) : isSubmitting ? (
                <><Loader2 style={{ width: 15, height: 15 }} className="animate-spin" />Submitting...</>
              ) : (
                <><Calendar style={{ width: 15, height: 15 }} />Schedule Consultation</>
              )}
            </button>
          </div>
        </Section>

        <div style={{ height: "12px" }} />
        </div> {/* end form content wrapper */}
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
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "10px",
          letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
        }}>
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
