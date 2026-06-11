"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { geoOrthographic, geoPath, geoBounds, geoGraticule } from "d3-geo"
import type { Feature, FeatureCollection, Polygon, MultiPolygon, GeoJsonProperties } from "geojson"

export interface GlobeMarker {
  name: string
  lng: number
  lat: number
}

// Module-level cache — shared across all RotatingEarth instances, single fetch
let _cachedGeoJson: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null = null
let _fetchPromise: Promise<FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>> | null = null

function getGeoJson(): Promise<FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties>> {
  if (_cachedGeoJson) return Promise.resolve(_cachedGeoJson)
  if (!_fetchPromise) {
    _fetchPromise = fetch("/ne_110m_land.json")
      .then((r) => { if (!r.ok) throw new Error("Failed to load land data"); return r.json() })
      .then((data) => { _cachedGeoJson = data; return data })
  }
  return _fetchPromise
}

// Call this early (e.g. after page load) to warm up the JSON cache so the
// globe renders instantly when the About section first mounts.
export function prefetchGlobeData() { getGeoJson() }

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  markers?: GlobeMarker[]
  // Read each render frame — zero-re-render way to control marker opacity from scroll
  markerOpacityRef?: { current: number }
}

export default function RotatingEarth({
  width = 700,
  height = 700,
  className = "",
  markers = [],
  markerOpacityRef,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    const containerWidth = Math.min(width, window.innerWidth - 40)
    const containerHeight = containerWidth
    const radius = containerWidth / 2.2

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = geoPath().projection(projection).context(context)

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i]
        const [xj, yj] = polygon[j]
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
      }
      return inside
    }

    const pointInFeature = (point: [number, number], feature: Feature): boolean => {
      const geometry = feature.geometry as Polygon | MultiPolygon
      if (geometry.type === "Polygon") {
        const coords = geometry.coordinates
        if (!pointInPolygon(point, coords[0] as number[][])) return false
        for (let i = 1; i < coords.length; i++) {
          if (pointInPolygon(point, coords[i] as number[][])) return false
        }
        return true
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0] as number[][])) {
            let inHole = false
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i] as number[][])) { inHole = true; break }
            }
            if (!inHole) return true
          }
        }
        return false
      }
      return false
    }

    const generateDotsInPolygon = (feature: Feature, dotSpacing = 16) => {
      const dots: [number, number][] = []
      const bounds = geoBounds(feature as Parameters<typeof geoBounds>[0])
      const [[minLng, minLat], [maxLng, maxLat]] = bounds
      const stepSize = dotSpacing * 0.08
      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat]
          if (pointInFeature(point, feature)) dots.push(point)
        }
      }
      return dots
    }

    const isVisible = (lng: number, lat: number): boolean => {
      const rot = projection.rotate()
      const lngRad = (lng + rot[0]) * (Math.PI / 180)
      const latRad = lat * (Math.PI / 180)
      const rotLatRad = (rot[1] ?? 0) * (Math.PI / 180)
      const cosDot =
        Math.cos(latRad) * Math.cos(rotLatRad) * Math.cos(lngRad) +
        Math.sin(latRad) * Math.sin(rotLatRad)
      return cosDot > 0
    }

    interface DotData { lng: number; lat: number }
    const allDots: DotData[] = []
    let landFeatures: FeatureCollection<Polygon | MultiPolygon, GeoJsonProperties> | null = null

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const currentScale = projection.scale()
      const sf = currentScale / radius

      // Ocean fill
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "rgba(0,0,0,0.85)"
      context.fill()
      context.strokeStyle = "rgba(255,255,255,0.35)"
      context.lineWidth = 1.5 * sf
      context.stroke()

      if (landFeatures) {
        // Graticule
        const graticule = geoGraticule()
        context.beginPath()
        path(graticule())
        context.strokeStyle = "rgba(255,255,255,0.12)"
        context.lineWidth = 0.8 * sf
        context.stroke()

        // Land outlines
        context.beginPath()
        landFeatures.features.forEach((feature) => path(feature as Parameters<typeof path>[0]))
        context.strokeStyle = "rgba(255,255,255,0.5)"
        context.lineWidth = 0.9 * sf
        context.stroke()

        // Land dots
        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat])
          if (
            projected &&
            projected[0] >= 0 && projected[0] <= containerWidth &&
            projected[1] >= 0 && projected[1] <= containerHeight
          ) {
            context.beginPath()
            context.arc(projected[0], projected[1], 1.3 * sf, 0, 2 * Math.PI)
            context.fillStyle = "rgba(180,180,180,0.75)"
            context.fill()
          }
        })

        // City markers — opacity driven by markerOpacityRef (0 = hidden, 1 = full)
        const mOpacity = markerOpacityRef ? markerOpacityRef.current : 1
        if (mOpacity > 0 && markers.length > 0) {
          markers.forEach((marker) => {
            if (!isVisible(marker.lng, marker.lat)) return
            const projected = projection([marker.lng, marker.lat])
            if (!projected) return
            const [px, py] = projected
            if (px < 0 || px > containerWidth || py < 0 || py > containerHeight) return

            const r = 3.5 * sf

            const glow = context.createRadialGradient(px, py, r * 0.5, px, py, r * 3.5)
            glow.addColorStop(0, `rgba(255,255,255,${0.65 * mOpacity})`)
            glow.addColorStop(1, "rgba(255,255,255,0)")
            context.beginPath()
            context.arc(px, py, r * 3.5, 0, 2 * Math.PI)
            context.fillStyle = glow
            context.fill()

            context.beginPath()
            context.arc(px, py, r * 1.9, 0, 2 * Math.PI)
            context.strokeStyle = `rgba(255,255,255,${0.65 * mOpacity})`
            context.lineWidth = 0.8 * sf
            context.stroke()

            context.beginPath()
            context.arc(px, py, r, 0, 2 * Math.PI)
            context.fillStyle = `rgba(255,255,255,${mOpacity})`
            context.fill()
          })
        }
      }
    }

    const loadWorldData = async () => {
      try {
        setIsLoading(true)
        landFeatures = await getGeoJson()
        landFeatures.features.forEach((feature) => {
          const dots = generateDotsInPolygon(feature as Feature, 16)
          dots.forEach(([lng, lat]) => allDots.push({ lng, lat }))
        })
        render()
        setIsLoading(false)
      } catch {
        setError("Failed to load globe data")
        setIsLoading(false)
      }
    }

    const rotation = [0, 0]
    let autoRotate = true
    let lastGlobeRender = 0
    const GLOBE_FRAME_MS = 1000 / 30 // 30fps cap

    const globeTick = () => {
      const now = performance.now()
      if (now - lastGlobeRender < GLOBE_FRAME_MS) return
      lastGlobeRender = now
      if (autoRotate) {
        rotation[0] += 0.8
        projection.rotate(rotation as [number, number])
        render()
      }
    }
    gsap.ticker.add(globeTick)

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false
      const startX = event.clientX
      const startY = event.clientY
      const startRotation = [...rotation]
      const onMove = (e: MouseEvent) => {
        rotation[0] = startRotation[0] + (e.clientX - startX) * 0.5
        rotation[1] = Math.max(-90, Math.min(90, startRotation[1] - (e.clientY - startY) * 0.5))
        projection.rotate(rotation as [number, number])
        render()
      }
      const onUp = () => {
        document.removeEventListener("mousemove", onMove)
        document.removeEventListener("mouseup", onUp)
        setTimeout(() => { autoRotate = true }, 10)
      }
      document.addEventListener("mousemove", onMove)
      document.addEventListener("mouseup", onUp)
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    loadWorldData()

    return () => {
      gsap.ticker.remove(globeTick)
      canvas.removeEventListener("mousedown", handleMouseDown)
    }
  }, [width, height, markers, markerOpacityRef])

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-2xl bg-white/5 p-8 ${className}`}>
        <p className="text-sm text-foreground/40">Globe unavailable</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
        </div>
      )}
      <canvas ref={canvasRef} className="rounded-full" style={{ display: isLoading ? "none" : "block" }} />
    </div>
  )
}
