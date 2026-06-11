"use client";

import React, { forwardRef, useImperativeHandle, useRef, useState, useCallback, useEffect } from "react";
import { PortfolioGallery } from "../ui/portfolio-gallery";
import { caseStudies } from "../CaseStudies/data";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { SolFooter } from "@/components/sections/sol-footer";

type GSAPType = typeof import("gsap").default;
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").default;

// ── Testimonials data ────────────────────────────────────────────────────────
const testimonials = [
  { industry: "Financial Services", quote: "SOL Advisers' AI-driven risk assessment platform has revolutionized our investment analysis process.", name: "James Chen", title: "CTO", company: "Global Investment Bank", results: ["40% improved risk prediction accuracy", "60% faster analysis time", "$2B+ in optimized investments"] },
  { industry: "Insurance", quote: "The digital transformation led by SOL Advisers has completely modernized our claims processing.", name: "Sarah Williams", title: "Head of Digital", company: "Leading Insurance Provider", results: ["75% reduction in claims processing time", "90% customer satisfaction", "35% cost reduction"] },
  { industry: "Healthcare", quote: "SOL Advisers' telemedicine platform has transformed how we deliver patient care.", name: "Dr. Michael Chang", title: "Medical Director", company: "Regional Healthcare Network", results: ["200% increase in patient reach", "45% reduction in wait times", "98% patient satisfaction"] },
  { industry: "Medical Research", quote: "Their AI solutions have accelerated our research capabilities significantly.", name: "Dr. Emily Rodriguez", title: "CEO", company: "Medical Research Institute", results: ["60% faster data analysis", "300% more research output", "45% cost optimization"] },
  { industry: "Manufacturing", quote: "SOL Advisers' predictive maintenance system has transformed our production efficiency.", name: "Robert Zhang", title: "Operations Director", company: "Advanced Manufacturing Corp", results: ["50% reduction in downtime", "40% maintenance cost savings", "25% productivity increase"] },
  { industry: "Automotive", quote: "Their IoT implementation has revolutionized our production line monitoring.", name: "Thomas Anderson", title: "Plant Manager", company: "Automotive Solutions", results: ["35% efficiency improvement", "60% defect reduction", "45% energy savings"] },
  { industry: "Retail", quote: "SOL Advisers' omnichannel solution has transformed our customer experience.", name: "Lisa Thompson", title: "Digital Director", company: "Retail Chain Group", results: ["150% online sales growth", "45% customer engagement increase", "30% operational efficiency"] },
  { industry: "E-commerce", quote: "Their AI-powered recommendation engine has significantly boosted our sales.", name: "David Park", title: "COO", company: "E-commerce Platform", results: ["80% better product recommendations", "40% higher conversion", "55% larger basket size"] },
  { industry: "Technology", quote: "SOL Advisers' cloud transformation strategy exceeded our expectations.", name: "Michelle Lee", title: "Innovation Lead", company: "Tech Solutions Inc", results: ["70% infrastructure cost reduction", "99.99% uptime achieved", "40% faster deployment"] },
  { industry: "SaaS", quote: "Their microservices architecture redesign transformed our scalability.", name: "Alex Rivera", title: "CTO", company: "SaaS Platform", results: ["300% improved scalability", "65% reduced latency", "45% development efficiency"] },
  { industry: "Energy", quote: "SOL Advisers' smart grid management system has revolutionized our operations.", name: "Jennifer Smith", title: "Sustainability Director", company: "Energy Solutions Corp", results: ["30% energy efficiency gain", "50% better demand prediction", "40% cost reduction"] },
  { industry: "Renewable Energy", quote: "Their AI-driven energy optimization platform has transformed our efficiency.", name: "Mark Johnson", title: "Operations Head", company: "Renewable Energy Group", results: ["45% improved energy distribution", "35% cost savings", "60% better forecasting"] },
  { industry: "Higher Education", quote: "SOL Advisers' digital learning platform has transformed our educational delivery.", name: "Dr. Rachel Brown", title: "Dean", company: "Global University", results: ["200% student engagement increase", "45% better learning outcomes", "60% cost efficiency"] },
  { industry: "EdTech", quote: "Their adaptive learning system has revolutionized our student success rates.", name: "Professor Alan White", title: "Director", company: "Online Learning Institute", results: ["75% completion rate increase", "90% student satisfaction", "50% better outcomes"] },
  { industry: "Logistics", quote: "SOL Advisers' supply chain optimization platform has transformed our operations.", name: "Carlos Martinez", title: "Logistics Director", company: "Global Shipping Corp", results: ["40% improved efficiency", "30% cost reduction", "50% better tracking"] },
  { industry: "Supply Chain", quote: "Their AI-driven route optimization has revolutionized our delivery efficiency.", name: "Anna Kim", title: "Supply Chain Head", company: "Logistics Solutions", results: ["35% faster deliveries", "45% fuel savings", "60% better accuracy"] },
];

// A = quote-forward (half-width), B = featured horizontal (full-width), C = minimal accent (half-width)
const cardTypes = ['A','A','B','A','C','A','C','B','A','A','C','A','B','A','C','A'] as const;

const getInitials = (name: string) =>
  name.split(" ").filter(n => /^[A-Za-z]/.test(n)).slice(0, 2).map(n => n[0]).join("");

const splitResult = (r: string) => {
  const idx = r.indexOf(" ");
  return idx === -1 ? { metric: r, desc: "" } : { metric: r.slice(0, idx), desc: r.slice(idx + 1) };
};

const glassA: React.CSSProperties = {
  background: "rgba(255,255,255,0.055)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.26), inset 0 -1px 0 rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.20)",
  borderRadius: 20,
  padding: 32,
  position: "relative",
  overflow: "hidden",
};

const glassB: React.CSSProperties = {
  background: "rgba(255,255,255,0.042)",
  border: "1px solid rgba(255,255,255,0.15)",
  boxShadow: "inset 0 2px 0 rgba(255,255,255,0.32), inset 0 -1px 0 rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.28)",
  borderRadius: 24,
  position: "relative",
  overflow: "hidden",
};

const glassC: React.CSSProperties = {
  background: "rgba(255,255,255,0.026)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderLeft: "2px solid rgba(255,255,255,0.20)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
  borderRadius: 20,
  padding: "28px 28px 28px 32px",
  position: "relative",
};

type DBTestimonial = {
  id: string; industry: string; quote: string; name: string;
  title: string; company: string; results: string[]; approved: boolean; created_at: string;
};

const emptyForm = { industry: "", quote: "", name: "", title: "", company: "", results: ["", "", ""] };

export const WorkSection = forwardRef((props: { isCurrent?: boolean; scrollToSection?: (index: number) => void }, ref) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const submitModalScrollRef = useRef<HTMLDivElement>(null);
  const [selectedStudy, setSelectedStudy] = useState<any>(null);

  // DB testimonials — only fetch when section becomes visible
  const [dbTestimonials, setDbTestimonials] = useState<DBTestimonial[]>([]);
  const testimonialsFetchedRef = useRef(false);
  React.useEffect(() => {
    if (!props.isCurrent || testimonialsFetchedRef.current) return;
    testimonialsFetchedRef.current = true;
    fetch("/api/testimonials")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setDbTestimonials(data); })
      .catch(() => {});
  }, [props.isCurrent]);

  // Submission modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.title.trim() || !form.company.trim() || !form.industry.trim() || !form.quote.trim()) return;
    setFormStatus("submitting");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, results: form.results.filter(r => r.trim()) }),
      });
      if (!res.ok) throw new Error();
      setFormStatus("success");
      setForm(emptyForm);
    } catch {
      setFormStatus("error");
    }
  };

  // Close modal + reset testimonials when navigating away
  React.useEffect(() => {
    if (props.isCurrent === false) {
      if (selectedStudy) setSelectedStudy(null);
      setShowAllTestimonials(false);
      setShowSubmitModal(false);
      setFormStatus("idle");
    }
  }, [props.isCurrent, selectedStudy]);

  useImperativeHandle(ref, () => ({
    scrollToTop: () => scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
    scrollToBottom: () =>
      scrollContainerRef.current?.scrollTo({
        top: scrollContainerRef.current!.scrollHeight,
        behavior: "smooth",
      }),
    getScrollElement: () => scrollContainerRef.current,
    isModalOpen: () => selectedStudy !== null,
  }));

  const galleryImages = caseStudies.map((study: any) => ({
    src: study.image,
    alt: study.title,
    title: study.title,
  }));

  const openModal = (index: number) => {
    setSelectedStudy(caseStudies[index]);
    setTimeout(() => modalScrollRef.current?.scrollTo({ top: 0 }), 50);
  };

  // Swallow all wheel and touch events inside the modal natively so the page doesn't navigate
  React.useEffect(() => {
    const scrollEl = modalScrollRef.current;
    if (!scrollEl) return;
    
    const stopProp = (e: Event) => e.stopPropagation();
    
    // Use passive: true so it doesn't block native scrolling performance
    scrollEl.addEventListener('wheel', stopProp, { passive: true });
    scrollEl.addEventListener('touchstart', stopProp, { passive: true });
    scrollEl.addEventListener('touchend', stopProp, { passive: true });
    scrollEl.addEventListener('touchmove', stopProp, { passive: true });
    
    return () => {
      scrollEl.removeEventListener('wheel', stopProp);
      scrollEl.removeEventListener('touchstart', stopProp);
      scrollEl.removeEventListener('touchend', stopProp);
      scrollEl.removeEventListener('touchmove', stopProp);
    };
  }, [selectedStudy]);

  React.useEffect(() => {
    const scrollEl = submitModalScrollRef.current;
    if (!scrollEl) return;
    const stopProp = (e: Event) => e.stopPropagation();
    scrollEl.addEventListener('wheel', stopProp, { passive: true });
    scrollEl.addEventListener('touchstart', stopProp, { passive: true });
    scrollEl.addEventListener('touchend', stopProp, { passive: true });
    scrollEl.addEventListener('touchmove', stopProp, { passive: true });
    return () => {
      scrollEl.removeEventListener('wheel', stopProp);
      scrollEl.removeEventListener('touchstart', stopProp);
      scrollEl.removeEventListener('touchend', stopProp);
      scrollEl.removeEventListener('touchmove', stopProp);
    };
  }, [showSubmitModal]);

  const handleModalWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
  }, []);

  const stTriggersRef = useRef<any[]>([]);
  const gsapRef = useRef<GSAPType | null>(null);
  const stRef = useRef<ScrollTriggerType | null>(null);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  // Helper to lazy-load GSAP + ScrollTrigger
  const getGsap = async () => {
    if (gsapRef.current && stRef.current) return { gsap: gsapRef.current, ScrollTrigger: stRef.current };
    const [{ default: g }, { default: ST }] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);
    g.registerPlugin(ST);
    gsapRef.current = g;
    stRef.current = ST;
    return { gsap: g, ScrollTrigger: ST };
  };

  React.useEffect(() => {
    if (!props.isCurrent) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    getGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      const cards = Array.from(container.querySelectorAll<HTMLElement>(".t-card"));
      gsap.set(cards, { opacity: 0, y: 52 });

      stTriggersRef.current.forEach(t => t.kill());
      stTriggersRef.current = [];

      timeout = setTimeout(() => {
        if (cancelled) return;
        const triggers = cards.map((card, i) => {
          const type = cardTypes[i] ?? "A";
          const colDelay = type === "B" ? 0 : (i % 2) * 0.13;
          return ScrollTrigger.create({
            trigger: card,
            scroller: container,
            start: "top 93%",
            onEnter: () => {
              gsap.to(card, { opacity: 1, y: 0, duration: 0.85, delay: colDelay, ease: "power3.out" });
            },
            onLeaveBack: () => {
              gsap.to(card, { opacity: 0, y: 52, duration: 0.3, ease: "power2.in" });
            },
          });
        });
        stTriggersRef.current = triggers;
        ScrollTrigger.refresh();
      }, 260);
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      stTriggersRef.current.forEach(t => t.kill());
      stTriggersRef.current = [];
    };
  }, [props.isCurrent]);


  return (
    <div className="w-screen h-screen shrink-0 overflow-hidden relative">
      <style>{`
        @media (max-width: 639px) {
          .t-card-b-inner { flex-direction: column !important; }
          .t-card-b-left { flex: none !important; padding: 20px !important; }
          .t-card-b-right { padding: 20px !important; }
          .t-card-b-divider { display: none !important; }
          .t-card { margin-left: 0 !important; margin-right: 0 !important; }
        }
      `}</style>
      {/* Gallery */}
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <PortfolioGallery
          title="Case Studies"
          images={galleryImages}
          onImageClick={openModal}
        />

        {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
        <div className="px-5 py-10 md:px-12 md:py-20" style={{ maxWidth: 1400, margin: "0 auto" }}>

          {/* Section header */}
          <div className="t-header" style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ height: 1, width: 36, background: "rgba(255,255,255,0.14)" }} />
              <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.32em", color: "rgba(255,255,255,0.26)", textTransform: "uppercase" }}>Client Voices</span>
            </div>
            <h2 style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", fontWeight: 700, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 14 }}>
              What our clients<br />actually say.
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, maxWidth: 420 }}>
              Transformation stories across 12 industries — in their own words.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
            {(showAllTestimonials ? [...testimonials, ...dbTestimonials] : [...testimonials, ...dbTestimonials].slice(0, 5)).map((t, i) => {
              const type = cardTypes[i] ?? "A";

              /* ── Card A: quote-forward, half-width ── */
              if (type === "A") return (
                <div key={i} className="t-card flex flex-col" style={glassA}>
                  {/* Top shimmer */}
                  <div style={{ position: "absolute", left: "12%", right: "12%", top: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.36) 40%, rgba(255,255,255,0.36) 60%, transparent)", pointerEvents: "none" }} />
                  {/* Inner scatter */}
                  <div style={{ position: "absolute", inset: 0, borderRadius: 20, background: "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 40%)", pointerEvents: "none" }} />

                  {/* Industry badge */}
                  <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.26em", color: "rgba(255,255,255,0.34)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 20, padding: "4px 10px", width: "fit-content", marginBottom: 20 }}>
                    {t.industry}
                  </span>

                  {/* Large quote mark */}
                  <div style={{ fontSize: 88, lineHeight: 1, color: "rgba(255,255,255,0.065)", fontFamily: "Georgia,'Times New Roman',serif", marginBottom: 2, marginLeft: -4, userSelect: "none" }}>&ldquo;</div>

                  {/* Quote */}
                  <p style={{ fontSize: 16, lineHeight: 1.7, color: "rgba(255,255,255,0.65)", flex: 1, marginBottom: 24 }}>
                    {t.quote}
                  </p>

                  {/* Divider */}
                  <div style={{ height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 20 }} />

                  {/* Person */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.60)", letterSpacing: "0.04em", flexShrink: 0 }}>
                      {getInitials(t.name)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.82)" }}>{t.name}</p>
                      <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.34)" }}>{t.title} · {t.company}</p>
                    </div>
                  </div>
                </div>
              );

              /* ── Card B: featured horizontal, full-width ── */
              if (type === "B") return (
                <div key={i} className="t-card t-card-b-inner" style={{ ...glassB, gridColumn: "1 / -1", display: "flex", padding: 0 }}>
                  {/* Top shimmer */}
                  <div style={{ position: "absolute", left: "8%", right: "8%", top: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.42) 35%, rgba(255,255,255,0.42) 65%, transparent)", pointerEvents: "none" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, transparent 40%)", pointerEvents: "none" }} />

                  {/* Left: quote */}
                  <div className="t-card-b-left" style={{ flex: "0 0 58%", padding: "40px 44px", display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.28em", color: "rgba(255,255,255,0.32)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 20, padding: "4px 10px", width: "fit-content", marginBottom: 22 }}>
                      {t.industry}
                    </span>
                    <div style={{ fontSize: 80, lineHeight: 1, color: "rgba(255,255,255,0.065)", fontFamily: "Georgia,'Times New Roman',serif", marginBottom: 4, marginLeft: -3, userSelect: "none" }}>&ldquo;</div>
                    <p style={{ fontSize: 19, lineHeight: 1.65, color: "rgba(255,255,255,0.72)", flex: 1, marginBottom: 28 }}>
                      {t.quote}
                    </p>
                    {/* Person */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.64)", letterSpacing: "0.04em", flexShrink: 0 }}>
                        {getInitials(t.name)}
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.86)" }}>{t.name}</p>
                        <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.36)" }}>{t.title} · {t.company}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vertical divider */}
                  <div className="t-card-b-divider" style={{ width: 1, background: "rgba(255,255,255,0.09)", alignSelf: "stretch", flexShrink: 0 }} />

                  {/* Right: key results */}
                  <div className="t-card-b-right" style={{ flex: 1, padding: "40px 44px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.30em", color: "rgba(255,255,255,0.26)", textTransform: "uppercase" }}>Key Results</span>
                    {t.results.map((r, ri) => {
                      const { metric, desc } = splitResult(r);
                      return (
                        <div key={ri}>
                          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.03em", color: "rgba(255,255,255,0.88)", lineHeight: 1 }}>{metric}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", marginTop: 4, textTransform: "capitalize" }}>{desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );

              /* ── Card C: minimal left-accent, half-width ── */
              return (
                <div key={i} className="t-card flex flex-col" style={glassC}>
                  {/* Industry badge */}
                  <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.26em", color: "rgba(255,255,255,0.30)", marginBottom: 18, display: "block" }}>
                    {t.industry}
                  </span>

                  {/* Quote — italic, larger */}
                  <p style={{ fontSize: 17, fontStyle: "italic", lineHeight: 1.68, color: "rgba(255,255,255,0.58)", flex: 1, marginBottom: 18 }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Person single line */}
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>
                    — {t.name}, {t.title} · {t.company}
                  </p>

                  {/* Top result only */}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ display: "block", height: 1, width: 10, background: "rgba(255,255,255,0.18)", flexShrink: 0 }} />
                    <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.40)" }}>{t.results[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show more / collapse */}
          {!showAllTestimonials && [...testimonials, ...dbTestimonials].length > 5 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
              <button
                onClick={() => {
                  setShowAllTestimonials(true);
                  setTimeout(() => {
                    const container = scrollContainerRef.current;
                    if (!container) return;
                    getGsap().then(({ gsap, ScrollTrigger }) => {
                      const cards = Array.from(container.querySelectorAll<HTMLElement>(".t-card"));
                      const newCards = cards.slice(5);
                      gsap.set(newCards, { opacity: 0, y: 52 });
                      stTriggersRef.current.forEach(t => t.kill());
                      stTriggersRef.current = [];
                      const triggers = newCards.map((card, i) => ScrollTrigger.create({
                        trigger: card,
                        scroller: container,
                        start: "top 93%",
                        onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.85, delay: (i % 2) * 0.13, ease: "power3.out" }),
                        onLeaveBack: () => gsap.to(card, { opacity: 0, y: 52, duration: 0.3, ease: "power2.in" }),
                      }));
                      stTriggersRef.current = triggers;
                      ScrollTrigger.refresh();
                    });
                  }, 50);
                }}
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  letterSpacing: "0.26em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  background: "rgba(255,255,255,0.055)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.13)",
                  borderRadius: 100,
                  padding: "14px 36px",
                  cursor: "pointer",
                  transition: "color 0.2s, background 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.90)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.10)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.055)";
                }}
              >
                Show {[...testimonials, ...dbTestimonials].length - 5} more voices
              </button>
            </div>
          )}

          {/* Share your story CTA */}
          <div style={{ marginTop: 64, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ height: 1, width: 48, background: "rgba(255,255,255,0.10)" }} />
            <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.22)", textTransform: "uppercase" }}>
              Worked with us?
            </p>
            <h3 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.025em", textAlign: "center" }}>
              Share your story
            </h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", textAlign: "center", maxWidth: 320, lineHeight: 1.65 }}>
              Your experience helps others make informed decisions.
            </p>
            <button
              onClick={() => { setShowSubmitModal(true); setFormStatus("idle"); }}
              style={{
                marginTop: 8,
                fontFamily: "monospace",
                fontSize: 11,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.70)",
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.16)",
                borderRadius: 100,
                padding: "14px 40px",
                cursor: "pointer",
                transition: "color 0.2s, background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.color = "rgba(255,255,255,0.95)";
                b.style.background = "rgba(255,255,255,0.12)";
                b.style.borderColor = "rgba(255,255,255,0.28)";
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement;
                b.style.color = "rgba(255,255,255,0.70)";
                b.style.background = "rgba(255,255,255,0.07)";
                b.style.borderColor = "rgba(255,255,255,0.16)";
              }}
            >
              Submit a testimonial
            </button>
          </div>
        </div>
        <SolFooter scrollToSection={props.scrollToSection} />
      </div>

      {/* ══════════════════════ SUBMIT MODAL ══════════════════════ */}
      {showSubmitModal && (
          <>
            <div
              className="absolute inset-0 z-[200]"
              style={{
                background: isDesktop ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.80)",
                backdropFilter: isDesktop ? "blur(16px)" : "none",
                transition: "opacity 0.25s",
              }}
              onClick={() => { if (formStatus !== "submitting") { setShowSubmitModal(false); setFormStatus("idle"); } }}
            />
            <div
              className="absolute inset-0 m-auto z-[210] flex flex-col"
              style={{
                width: "min(92vw, 560px)",
                height: "fit-content",
                maxHeight: "85vh",
                background: isDesktop ? "rgba(255,255,255,0.06)" : "rgba(10,10,20,0.96)",
                backdropFilter: isDesktop ? "blur(16px)" : "none",
                WebkitBackdropFilter: isDesktop ? "blur(16px)" : "none",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.28), 0 24px 64px rgba(0,0,0,0.45)",
                borderRadius: 24,
                overflow: "hidden",
                animation: "sol-modal-in 0.4s cubic-bezier(0.22,1,0.36,1) both",
              }}
            >
              {/* Top shimmer */}
              <div style={{ position: "absolute", inset: "0 8% auto", height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.42) 40%, rgba(255,255,255,0.42) 60%, transparent)", pointerEvents: "none" }} />

              <div ref={submitModalScrollRef} style={{ padding: "36px 36px 32px", overflowY: "auto", maxHeight: "85vh", scrollbarWidth: "none" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
                  <div>
                    <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.3em", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: 6 }}>Client Voices</p>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "white", letterSpacing: "-0.025em" }}>Share your experience</h2>
                  </div>
                  <button
                    onClick={() => { if (formStatus !== "submitting") { setShowSubmitModal(false); setFormStatus("idle"); } }}
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
                  >
                    <X size={14} color="rgba(255,255,255,0.55)" />
                  </button>
                </div>

                {formStatus === "success" ? (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "white", marginBottom: 8 }}>Thank you!</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", lineHeight: 1.65 }}>
                      Your testimonial has been submitted and is pending review. We&rsquo;ll publish it shortly.
                    </p>
                    <button
                      onClick={() => { setShowSubmitModal(false); setFormStatus("idle"); }}
                      style={{ marginTop: 24, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", borderRadius: 100, padding: "11px 28px", cursor: "pointer" }}
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Row 1: Name + Title */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        { key: "name", label: "Full Name", placeholder: "Jane Smith", required: true },
                        { key: "title", label: "Job Title", placeholder: "CEO", required: true },
                      ].map(({ key, label, placeholder, required }) => (
                        <div key={key}>
                          <label style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.30)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            {label}{required && " *"}
                          </label>
                          <input
                            value={(form as any)[key]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            placeholder={placeholder}
                            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Row 2: Company + Industry */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      {[
                        { key: "company", label: "Company", placeholder: "Acme Corp", required: true },
                        { key: "industry", label: "Industry", placeholder: "Financial Services", required: true },
                      ].map(({ key, label, placeholder, required }) => (
                        <div key={key}>
                          <label style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.30)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            {label}{required && " *"}
                          </label>
                          <input
                            value={(form as any)[key]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            placeholder={placeholder}
                            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Quote */}
                    <div>
                      <label style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.30)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Your Testimonial *
                      </label>
                      <textarea
                        value={form.quote}
                        onChange={e => setForm(f => ({ ...f, quote: e.target.value }))}
                        placeholder="Tell us about your experience working with SOL Advisers…"
                        rows={4}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 10, padding: "10px 14px", color: "white", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", resize: "vertical", lineHeight: 1.65 }}
                      />
                    </div>

                    {/* Key Results */}
                    <div>
                      <label style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,255,255,0.30)", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                        Key Results <span style={{ color: "rgba(255,255,255,0.18)" }}>(optional — up to 3)</span>
                      </label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {form.results.map((r, i) => (
                          <input
                            key={i}
                            value={r}
                            onChange={e => setForm(f => { const results = [...f.results]; results[i] = e.target.value; return { ...f, results }; })}
                            placeholder={`e.g. 40% cost reduction`}
                            style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px", color: "white", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }}
                          />
                        ))}
                      </div>
                    </div>

                    {formStatus === "error" && (
                      <p style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,80,80,0.85)", letterSpacing: "0.06em" }}>
                        Something went wrong. Please try again.
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={formStatus === "submitting" || !form.name.trim() || !form.title.trim() || !form.company.trim() || !form.industry.trim() || !form.quote.trim()}
                      style={{
                        marginTop: 4,
                        fontFamily: "monospace",
                        fontSize: 11,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: formStatus === "submitting" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.85)",
                        background: "rgba(255,255,255,0.09)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        borderRadius: 100,
                        padding: "14px 36px",
                        cursor: formStatus === "submitting" ? "default" : "pointer",
                        width: "100%",
                        transition: "color 0.2s, background 0.2s",
                      }}
                    >
                      {formStatus === "submitting" ? "Submitting…" : "Submit testimonial"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}




      {/* ══════════════════════ MODAL ══════════════════════ */}
      <AnimatePresence>
        {selectedStudy && (() => {
          const s = selectedStudy;
          const glass = {
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.14)",
            boxShadow: [
              "inset 0 1.5px 0 rgba(255,255,255,0.22)",
              "inset 0 -1px 0 rgba(0,0,0,0.12)",
              "inset 1px 0 0 rgba(255,255,255,0.08)",
              "inset -1px 0 0 rgba(255,255,255,0.08)",
              "0 8px 32px rgba(0,0,0,0.28)",
            ].join(", "),
            borderRadius: 16,
          } as React.CSSProperties;
          const label = "font-mono text-[9px] uppercase tracking-[0.28em] text-white/30 mb-2 block";
          return (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-[200]"
                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(16px)" }}
                onClick={() => setSelectedStudy(null)}
                onWheel={handleModalWheel}
              />

              {/* Panel */}
              <motion.div
                key="panel"
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 m-auto z-[210] flex flex-col"
                style={{
                  width: "min(96vw, 1360px)",
                  height: "min(82vh, 720px)",
                  marginTop: "72px",
                  background: "rgba(8, 10, 24, 0.72)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  boxShadow: [
                    "inset 0 2px 0 rgba(255,255,255,0.32)",
                    "inset 0 -1px 0 rgba(0,0,0,0.15)",
                    "inset 1px 0 0 rgba(255,255,255,0.12)",
                    "inset -1px 0 0 rgba(255,255,255,0.12)",
                    "0 48px 120px rgba(0,0,0,0.65)",
                    "0 8px 32px rgba(0,0,0,0.40)",
                  ].join(", "),
                  borderRadius: 26,
                  overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
                onWheel={handleModalWheel}
              >
                {/* Specular top shimmer */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 30%, rgba(255,255,255,0.55) 70%, transparent 100%)" }} />
                {/* Inner light scatter */}
                <div className="pointer-events-none absolute inset-0 rounded-[26px]" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)" }} />

                {/* Scrollable content wrapper — enables full scroll on mobile */}
                <div
                  ref={modalScrollRef}
                  className="relative flex flex-col flex-1 overflow-y-auto min-h-0"
                  style={{ padding: 32, gap: 18, scrollbarWidth: "none", msOverflowStyle: "none" }}
                >

                {/* ── HEADER ── */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.38, ease: [0.22,1,0.36,1] }}
                  className="flex items-start justify-between shrink-0"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="w-fit font-mono text-[9px] uppercase tracking-[0.28em] text-white/40 px-3 py-1 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                      {s.category}
                    </span>
                    <h2 className="font-sans font-bold text-white leading-tight" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.2rem)", letterSpacing: "-0.03em" }}>
                      {s.title}
                    </h2>
                    <p className="font-mono text-[11px] text-white/32 tracking-wide">{s.client}</p>
                  </div>
                  <button
                    onClick={() => setSelectedStudy(null)}
                    className="shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.10)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                  >
                    <X size={12} className="text-white/55" />
                  </button>
                </motion.div>

                {/* ── DESCRIPTION ── */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                  className="font-sans text-[13px] text-white/42 leading-relaxed shrink-0"
                  style={{ maxWidth: "70ch" }}
                >
                  {s.description}
                </motion.p>

                {/* ── STATS ROW ── */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.26, duration: 0.36, ease: [0.22,1,0.36,1] }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0"
                >
                  <div className="flex flex-col p-4" style={glass}>
                    <span className={label}>Timeline</span>
                    <span className="font-sans text-2xl font-light text-white leading-none">
                      {s.timeline}
                    </span>
                  </div>
                  <div className="flex flex-col p-4" style={glass}>
                    <span className={label}>ROI</span>
                    <span className="font-sans text-[15px] font-semibold text-white leading-snug">{s.roi}</span>
                  </div>
                  <div className="flex flex-col p-4" style={{ ...glass, background: "rgba(255,255,255,0.052)" }}>
                    <span className={label}>Key Result</span>
                    <span className="font-sans text-[13px] font-medium text-white/80 leading-snug">{s.highlight}</span>
                  </div>
                </motion.div>

                {/* ── MAIN GRID ── */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.36, ease: [0.22,1,0.36,1] }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {/* Challenge + Solution */}
                  <div className="flex flex-col p-5" style={glass}>
                    <span className={label}>The Challenge</span>
                    <p className="font-sans text-[13px] text-white/52 leading-relaxed">{s.challenge}</p>
                    <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      <span className={label}>The Solution</span>
                      <p className="font-sans text-[13px] text-white/52 leading-relaxed">
                        {s.solution.replace(/\n- /g, " · ").replace(/\n/g, " ")}
                      </p>
                    </div>
                  </div>

                  {/* Key Impacts */}
                  <div className="flex flex-col p-5" style={glass}>
                    <span className={label}>Key Impacts</span>
                    <ul className="flex flex-col gap-3 mt-1">
                      {s.impacts.map((impact: string, i: number) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.065, duration: 0.28, ease: [0.22,1,0.36,1] }}
                          className="flex items-start gap-3"
                        >
                          <span className="shrink-0 mt-[5px] h-px w-4 bg-white/22 block" />
                          <span className="font-sans text-[13px] text-white/65 leading-snug">{impact}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                </div>{/* end scroll wrapper */}
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </div>
  );
});

WorkSection.displayName = "WorkSection";
