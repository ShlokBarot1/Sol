"use client"

import React, { useState } from "react"

interface DBTestimonial {
  id: string
  name: string
  title: string
  company: string
  industry: string
  quote: string
  results: string[]
  created_at: string
}

const glass: React.CSSProperties = {
  background: "rgba(255,255,255,0.055)",
  backdropFilter: "blur(40px) saturate(120%) brightness(1.08)",
  WebkitBackdropFilter: "blur(40px) saturate(120%) brightness(1.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.26), 0 8px 32px rgba(0,0,0,0.20)",
  borderRadius: 16,
  padding: 24,
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "12px 16px",
  color: "white",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
}

export default function AdminTestimonialsPage() {
  const [passcode, setPasscode] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState("")
  const [testimonials, setTestimonials] = useState<DBTestimonial[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [storedPasscode, setStoredPasscode] = useState("")

  const login = async () => {
    setLoading(true)
    setAuthError("")
    try {
      const res = await fetch("/api/admin/testimonials", {
        headers: { "x-admin-passcode": passcode },
      })
      if (res.status === 401) {
        setAuthError("Wrong passcode")
        setLoading(false)
        return
      }
      const data = await res.json()
      setTestimonials(Array.isArray(data) ? data : [])
      setStoredPasscode(passcode)
      setAuthed(true)
    } catch {
      setAuthError("Connection failed")
    }
    setLoading(false)
  }

  const doAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id + action)
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, passcode: storedPasscode }),
      })
      setTestimonials((prev) => prev.filter((t) => t.id !== id))
    } catch {
      // silently fail — item stays in list
    }
    setActionLoading(null)
  }

  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050508",
        }}
      >
        <div style={{ ...glass, width: 360, textAlign: "center" }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.30)",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            Admin Access
          </p>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            Testimonial Review
          </h1>
          <input
            type="password"
            placeholder="Enter passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ ...inputStyle, marginBottom: 12 }}
          />
          {authError && (
            <p
              style={{
                color: "rgba(255,80,80,0.85)",
                fontSize: 12,
                fontFamily: "monospace",
                marginBottom: 12,
              }}
            >
              {authError}
            </p>
          )}
          <button
            onClick={login}
            disabled={loading || !passcode}
            style={{
              width: "100%",
              background: loading ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: 10,
              padding: "12px 16px",
              color: "rgba(255,255,255,0.85)",
              fontSize: 11,
              cursor: loading || !passcode ? "default" : "pointer",
              fontFamily: "monospace",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {loading ? "Loading…" : "Enter"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "#050508", padding: "48px 32px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              letterSpacing: "0.3em",
              color: "rgba(255,255,255,0.28)",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            SOL Advisers · Admin Panel
          </p>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-0.02em",
              marginBottom: 6,
            }}
          >
            Pending Testimonials
          </h1>
          <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 13, fontFamily: "monospace" }}>
            {testimonials.length} awaiting review
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div style={{ ...glass, textAlign: "center", padding: 56 }}>
            <p style={{ color: "rgba(255,255,255,0.32)", fontSize: 14 }}>
              No pending testimonials — all clear.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {testimonials.map((t) => (
              <div key={t.id} style={glass}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 20,
                  }}
                >
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        color: "rgba(255,255,255,0.30)",
                        textTransform: "uppercase",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: 20,
                        padding: "3px 9px",
                        display: "inline-block",
                        marginBottom: 12,
                      }}
                    >
                      {t.industry}
                    </span>
                    <p
                      style={{
                        fontSize: 15,
                        color: "rgba(255,255,255,0.68)",
                        lineHeight: 1.65,
                        fontStyle: "italic",
                        marginBottom: 14,
                      }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                      {t.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        color: "rgba(255,255,255,0.35)",
                        marginBottom: 10,
                      }}
                    >
                      {t.title} · {t.company}
                    </p>
                    {t.results?.filter((r) => r).length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {t.results.filter((r) => r).map((r, i) => (
                          <span
                            key={i}
                            style={{
                              fontFamily: "monospace",
                              fontSize: 10,
                              color: "rgba(255,255,255,0.40)",
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.08)",
                              borderRadius: 4,
                              padding: "3px 8px",
                            }}
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                    <p
                      style={{
                        fontFamily: "monospace",
                        fontSize: 9,
                        color: "rgba(255,255,255,0.18)",
                        marginTop: 10,
                      }}
                    >
                      Submitted{" "}
                      {new Date(t.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => doAction(t.id, "approve")}
                      disabled={actionLoading !== null}
                      style={{
                        padding: "9px 22px",
                        background: "rgba(255,255,255,0.09)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        borderRadius: 8,
                        color:
                          actionLoading === t.id + "approve"
                            ? "rgba(255,255,255,0.40)"
                            : "rgba(255,255,255,0.82)",
                        fontSize: 11,
                        fontFamily: "monospace",
                        cursor: actionLoading !== null ? "default" : "pointer",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      {actionLoading === t.id + "approve" ? "…" : "Approve"}
                    </button>
                    <button
                      onClick={() => doAction(t.id, "reject")}
                      disabled={actionLoading !== null}
                      style={{
                        padding: "9px 22px",
                        background: "rgba(255,40,40,0.07)",
                        border: "1px solid rgba(255,60,60,0.22)",
                        borderRadius: 8,
                        color:
                          actionLoading === t.id + "reject"
                            ? "rgba(255,100,100,0.35)"
                            : "rgba(255,100,100,0.75)",
                        fontSize: 11,
                        fontFamily: "monospace",
                        cursor: actionLoading !== null ? "default" : "pointer",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                      }}
                    >
                      {actionLoading === t.id + "reject" ? "…" : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
