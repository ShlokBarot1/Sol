"use client"

import { useEffect } from "react"

export function PowerSaver() {
  useEffect(() => {
    const apply = (save: boolean) =>
      document.documentElement.classList.toggle("power-save", save)

    if ("getBattery" in navigator) {
      ;(navigator as any).getBattery().then((bat: any) => {
        const check = () => apply(!bat.charging && bat.level <= 0.15)
        check()
        bat.addEventListener("chargingchange", check)
        bat.addEventListener("levelchange", check)
      }).catch(() => {})
    }
  }, [])

  return null
}
