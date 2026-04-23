import { useEffect, useRef } from "react"

const IDLE_EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "wheel", "click"]

export function useIdleReset(onIdle: () => void, delayMs: number, active: boolean) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearTimeout(timerRef.current)
      return
    }

    function reset() {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(onIdle, delayMs)
    }

    reset() // start timer immediately on mount

    IDLE_EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      IDLE_EVENTS.forEach(e => window.removeEventListener(e, reset))
    }
  }, [active, delayMs, onIdle])
}