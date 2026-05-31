"use client"

import { ArrowRight } from "lucide-react"
import React from "react"
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"

const workItems = [
  {
    title: "Revolutionary Social Media Platform",
    client: "Confidential",
    category: "Platform Development",
    metric: "400%",
    metricLabel: "User Growth",
    secondary: "14mo",
    secondaryLabel: "Timeline",
    accent: "#ec4899",
    impacts: [
      "400% user growth in 12 months",
      "Strategic brand partnerships established",
      "Successfully acquired at premium multiple",
    ],
  },
  {
    title: "Luxury Hospitality Transformation",
    client: "EMA Hospitality",
    category: "Digital Transformation",
    metric: "375%",
    metricLabel: "ROI Year 1",
    secondary: "6mo",
    secondaryLabel: "Deployment",
    accent: "#d4af37",
    impacts: [
      "Digital-first guest experience launched",
      "Revenue management AI implemented",
      "Occupancy up 28% post-transformation",
    ],
  },
  {
    title: "Global Ministry Digital Reach",
    client: "Bill Winston Ministries",
    category: "Tech Modernization",
    metric: "250%",
    metricLabel: "Engagement ↑",
    secondary: "190+",
    secondaryLabel: "Countries",
    accent: "#8b5cf6",
    impacts: [
      "Streaming infrastructure rebuilt from ground up",
      "Multilingual content delivery system",
      "Mobile-first platform reaching 190+ nations",
    ],
  },
  {
    title: "Smart Dental Practice",
    client: "Bayside Dental",
    category: "Smart Systems",
    metric: "185%",
    metricLabel: "New Patients",
    secondary: "3×",
    secondaryLabel: "Efficiency",
    accent: "#0ea5e9",
    impacts: [
      "Automated scheduling & reminders",
      "AI-powered treatment plan recommendations",
      "Paperless workflows across all locations",
    ],
  },
  {
    title: "AI Hotel Asset Management",
    client: "Luxury Hotels Int'l",
    category: "AI Solutions",
    metric: "32%",
    metricLabel: "Cost Reduction",
    secondary: "$18M",
    secondaryLabel: "Annual Savings",
    accent: "#6366f1",
    impacts: [
      "Predictive maintenance across 40 properties",
      "Energy optimisation via ML models",
      "Real-time asset tracking dashboard",
    ],
  },
  {
    title: "AI-Powered Retail Innovation",
    client: "Global Retail Chain",
    category: "AI & Innovation",
    metric: "70%",
    metricLabel: "Faster Response",
    secondary: "4.8★",
    secondaryLabel: "CSAT Score",
    accent: "#10b981",
    impacts: [
      "Conversational AI handling 80% of queries",
      "Personalised product recommendation engine",
      "Inventory forecasting accuracy at 96%",
    ],
  },
]

const liquidGlass: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.16)",
  boxShadow: [
    "inset 0 2px 0 0 rgba(255,255,255,0.32)",
    "inset 0 -1px 0 0 rgba(0,0,0,0.06)",
    "inset 1px 0 0 0 rgba(255,255,255,0.09)",
    "inset -1px 0 0 0 rgba(255,255,255,0.09)",
    "0 24px 64px rgba(0,0,0,0.42)",
    "0 4px 20px rgba(0,0,0,0.18)",
  ].join(", "),
}

const glassBadge: React.CSSProperties = {
  background: "rgba(255,255,255,0.10)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.18)",
  boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.22)",
  color: "rgba(255,255,255,0.75)",
}

const css = `
  .work-swiper {
    width: 100%;
    height: 540px;
    padding-bottom: 52px !important;
    overflow: visible !important;
  }

  .work-swiper .swiper-wrapper {
    overflow: visible;
  }

  .work-swiper .swiper-slide {
    width: 420px;
    height: 100%;
  }

  .work-swiper .swiper-pagination-bullet {
    background-color: rgba(255,255,255,0.25) !important;
    opacity: 1 !important;
    width: 6px !important;
    height: 6px !important;
    border-radius: 3px !important;
    transition: transform 0.3s ease, background-color 0.3s ease !important;
    will-change: transform;
  }

  .work-swiper .swiper-pagination-bullet-active {
    background-color: rgba(255,255,255,0.75) !important;
    transform: scaleX(3.3) !important;
  }

  .work-swiper .swiper-slide-shadow-left,
  .work-swiper .swiper-slide-shadow-right {
    border-radius: 2rem;
  }

  @media (max-width: 640px) {
    .work-swiper .swiper-slide {
      width: 300px;
    }
    .work-swiper {
      height: 480px;
    }
  }
`

interface WorkCarouselProps {
  onViewAll?: () => void
}

export function WorkCarousel({ onViewAll }: WorkCarouselProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-[540px]" />
  }

  return (
    <div className="relative w-full">
      <style>{css}</style>

      <Swiper
        className="work-swiper"
        modules={[EffectCoverflow, Autoplay, Pagination]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        speed={900}
        autoplay={{
          delay: 2200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        coverflowEffect={{
          rotate: 18,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false,
        }}
        watchSlidesProgress={true}
        pagination={{ clickable: true }}
      >
        {workItems.map((item, index) => (
          <SwiperSlide key={index}>
            {/* Liquid glass card */}
            <div
              className="relative h-full w-full rounded-[2rem] overflow-hidden flex flex-col"
              style={liquidGlass}
            >
              {/* Specular sheen */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[2rem]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 35%, transparent 65%)",
                }}
              />


              {/* ── Content ── */}
              <div className="relative flex flex-col h-full p-8">

                {/* Row 1: category + client */}
                <div className="flex items-center justify-between">
                  <span
                    className="inline-block rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
                    style={glassBadge}
                  >
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] text-foreground/35 tracking-wide">
                    {item.client}
                  </span>
                </div>

                {/* Row 2: hero metric + secondary */}
                <div className="mt-8 flex items-end gap-6">
                  <div>
                    <p
                      className="font-sans font-light leading-none text-foreground"
                      style={{ fontSize: "clamp(64px, 10vw, 96px)", letterSpacing: "-0.04em" }}
                    >
                      {item.metric}
                    </p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                      {item.metricLabel}
                    </p>
                  </div>

                  <div className="mb-2 border-l border-foreground/10 pl-6">
                    <p className="font-sans text-2xl font-light text-foreground/80">
                      {item.secondary}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-foreground/35">
                      {item.secondaryLabel}
                    </p>
                  </div>
                </div>

                {/* Row 3: title */}
                <h3
                  className="mt-6 font-sans font-light leading-snug text-foreground"
                  style={{ fontSize: "clamp(17px, 2.2vw, 22px)" }}
                >
                  {item.title}
                </h3>

                {/* Row 4: impact bullets */}
                <ul className="mt-5 space-y-2.5 flex-1">
                  {item.impacts.map((impact, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span
                        className="mt-[6px] h-1 w-1 flex-shrink-0 rounded-full"
                        style={{ background: "rgba(255,255,255,0.35)" }}
                      />
                      <span className="text-sm leading-relaxed text-foreground/50">
                        {impact}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Row 5: CTA */}
                <button
                  onClick={onViewAll}
                  className="group mt-6 flex items-center gap-2 text-foreground/35 transition-colors duration-300 hover:text-foreground/70 self-start"
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest">
                    View case study
                  </span>
                  <ArrowRight
                    size={11}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
