"use client"

interface SolFooterProps {
  scrollToSection?: (index: number) => void
}

const NAV_ITEMS = [
  { label: "Home", index: 0 },
  { label: "Case Studies", index: 1 },
  { label: "Services", index: 2 },
  { label: "About", index: 3 },
  { label: "Contact", index: 4 },
]

function NavRow({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        background: "none",
        border: "none",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        padding: "1rem 0",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
        fontWeight: 400,
        letterSpacing: "-0.01em",
        color: "rgba(255,255,255,0.85)",
        textAlign: "left",
        transition: "color 0.2s ease",
        lineHeight: 1.3,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.color = "rgba(255,255,255,1)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.color = "rgba(255,255,255,0.85)"
      }}
    >
      <span>{label}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.5, flexShrink: 0 }}
        aria-hidden="true"
      >
        <path d="M7 17L17 7M17 7H7M17 7v10" />
      </svg>
    </button>
  )
}

function SocialBtn({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.05)",
        color: "rgba(255,255,255,0.55)",
        textDecoration: "none",
        transition: "border-color 0.2s ease, background 0.2s ease, color 0.2s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.borderColor = "rgba(255,255,255,0.35)"
        el.style.background = "rgba(255,255,255,0.12)"
        el.style.color = "rgba(255,255,255,0.95)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLAnchorElement
        el.style.borderColor = "rgba(255,255,255,0.18)"
        el.style.background = "rgba(255,255,255,0.05)"
        el.style.color = "rgba(255,255,255,0.55)"
      }}
    >
      {children}
    </a>
  )
}

export function SolFooter({ scrollToSection }: SolFooterProps) {
  return (
    <footer
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "clamp(2rem, 4vw, 3rem) clamp(1.5rem, 6vw, 5rem) 0",
      }}
    >
      {/* Two-column main body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(2rem, 5vw, 4rem)",
          alignItems: "start",
        }}
      >
        {/* LEFT: CTA text + button + SOL wordmark */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <p
            style={{
              fontFamily: "inherit",
              fontSize: "clamp(0.95rem, 1.6vw, 1.2rem)",
              fontWeight: 300,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
              margin: 0,
              maxWidth: "22rem",
            }}
          >
            Wealth is complex.{" "}
            <span style={{ color: "rgba(255,255,255,0.45)" }}>
              Reaching us isn&rsquo;t.
            </span>
            <br />
            <span style={{ color: "rgba(255,255,255,0.45)" }}>
              Contact the SOL team anytime.
            </span>
          </p>

          <button
            onClick={() => scrollToSection?.(4)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.25rem",
              borderRadius: 6,
              fontFamily: "inherit",
              fontSize: "0.85rem",
              fontWeight: 500,
              color: "rgba(255,255,255,1)",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.28)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              cursor: "pointer",
              width: "fit-content",
              whiteSpace: "nowrap",
              transition: "background 0.2s ease, border-color 0.2s ease",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={e => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = "rgba(255,255,255,0.14)"
              b.style.borderColor = "rgba(255,255,255,0.30)"
            }}
            onMouseLeave={e => {
              const b = e.currentTarget as HTMLButtonElement
              b.style.background = "rgba(255,255,255,0.08)"
              b.style.borderColor = "rgba(255,255,255,0.18)"
            }}
          >
            Get in touch
          </button>

          {/* Office Hours */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "0.5rem" }}>
            <p style={{ fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.30)", margin: 0 }}>
              Office Hours
            </p>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.38)", margin: "0 0 0.15rem" }}>Monday – Friday</p>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.80)", margin: 0 }}>9:00 AM – 6:00 PM EST</p>
              </div>
              <div>
                <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.38)", margin: "0 0 0.15rem" }}>Saturday – Sunday</p>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.80)", margin: 0 }}>Closed</p>
              </div>
            </div>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.28)", margin: 0, lineHeight: 1.5 }}>
              24/7 support available for enterprise clients
            </p>
          </div>

          {/* SOL wordmark — lives in left col */}
          <h2
            aria-label="SOL Advisers"
            style={{
              fontFamily: "inherit",
              fontWeight: 900,
              fontSize: "clamp(72px, 16vw, 220px)",
              letterSpacing: "-0.04em",
              lineHeight: 0.84,
              color: "rgba(255,255,255,1)",
              margin: 0,
              userSelect: "none",
              marginTop: "auto",
            }}
          >
            SOL
          </h2>
        </div>

        {/* RIGHT: Nav items as rows */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }} />
          {NAV_ITEMS.map(item => (
            <NavRow
              key={item.label}
              label={item.label}
              onClick={() => scrollToSection?.(item.index)}
            />
          ))}

          <div style={{ display: "flex", gap: "0.5rem", paddingTop: "1.25rem" }}>
            <SocialBtn href="https://linkedin.com/company/soladvisers" label="LinkedIn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </SocialBtn>
            <SocialBtn href="https://x.com/soladvisers" label="X (Twitter)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialBtn>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          padding: "1rem 0 clamp(1rem, 2vw, 1.75rem)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          marginTop: "1rem",
        }}
      >
        <span style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.24)", letterSpacing: "0.04em" }}>
          © 2026 All rights reserved, SOL Advisers
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {["Privacy Policy", "Terms of Use"].map(label => (
            <a
              key={label}
              href="#"
              style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.24)", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.18s" }}
              onMouseEnter={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.60)" }}
              onMouseLeave={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.24)" }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
