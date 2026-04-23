import { useEffect, useRef, useState, useCallback } from "react"
import PixelButton from "../ideal/shared/PixelButton"

function css(v: string) {
  return `var(${v})`
}

type Directive = {
  time: string
  directive: string
  rationale: string
}

const DIRECTIVES: Directive[] = [
  { time: "06:47", directive: "Do not check your phone for the next 22 minutes.", rationale: "Morning cortisol peak detected. Premature input exposure reduces cognitive clarity window by an estimated 31%." },
  { time: "08:30", directive: "Begin your highest-priority task now. Do not check messages first.", rationale: "Your focus window peaks between 08:15 and 10:40. Task initiation delay of more than 12 minutes significantly reduces output quality." },
  { time: "10:55", directive: "Take a 9-minute walk. Do not bring your phone.", rationale: "Sustained focus duration has reached its optimal endpoint. A brief unmediated break will restore attention capacity for your afternoon block." },
  { time: "12:30", directive: "Eat lunch alone today.", rationale: "Your social energy reserves are below threshold. A social lunch will create a deficit that affects your afternoon output by an estimated 22%." },
  { time: "14:10", directive: "Do not respond to the message from your mother until after 6pm.", rationale: "Engagement now will reduce your remaining output window by an estimated 34 minutes. The message does not require urgent response." },
  { time: "15:30", directive: "You are about to reach out to someone for support. Wait 20 minutes first.", rationale: "This impulse pattern has been identified before. In 71% of prior instances, the urge subsided without action. IDEAL recommends observation before engagement." },
  { time: "18:00", directive: "Do not discuss your day with anyone tonight.", rationale: "Processing low-recovery days verbally increases rumination likelihood by 38% in your profile. Rest is the higher-value output." },
  { time: "22:00", directive: "Sleep.", rationale: "All conditions are optimal. Delaying sleep onset by more than 11 minutes will shift your recovery curve and reduce tomorrow's output by 14%." },
]

const START_TIME = "06:00"
const END_TIME = "22:30"

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

function fromMinutes(total: number) {
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

const SLOT_SIZE = 1000
const OVERLAP = 40
const RED_BAND_START = 0.25
const RED_BAND_END = 0.75
const DRIFT_PX = 80
const FADE_ZONE = 0.22

const N = DIRECTIVES.length

const INTRO_SIZE = 600
const OUTRO_SIZE = 800

function directiveCenter(i: number): number {
  return INTRO_SIZE + SLOT_SIZE / 2 + i * (SLOT_SIZE - OVERLAP)
}

const DIRECTIVES_END = directiveCenter(N - 1) + SLOT_SIZE / 2
const TOTAL_SCROLL = DIRECTIVES_END + OUTRO_SIZE

function getDirectiveState(i: number, scroll: number) {
  const center = directiveCenter(i)
  const t = (scroll - (center - SLOT_SIZE / 2)) / SLOT_SIZE
  const tClamped = Math.max(0, Math.min(1, t))
  const translateY = DRIFT_PX / 2 - tClamped * DRIFT_PX
  let opacity = 1
  if (tClamped < FADE_ZONE) opacity = tClamped / FADE_ZONE
  else if (tClamped > 1 - FADE_ZONE) opacity = (1 - tClamped) / FADE_ZONE
  const visible = t >= 0 && t <= 1
  return { t: tClamped, translateY, opacity, visible }
}

function getClockState(scroll: number): { time: string; red: boolean; opacity: number } {
  const introProgress = Math.min(1, scroll / INTRO_SIZE)
  const outroStart = DIRECTIVES_END
  const outroProgress = Math.max(0, (scroll - outroStart) / (OUTRO_SIZE * 0.2))
  const clockOpacity = Math.max(0, Math.min(introProgress, 1 - outroProgress))

  for (let i = 0; i < N; i++) {
    const center = directiveCenter(i)
    const slotStart = center - SLOT_SIZE / 2
    const t = (scroll - slotStart) / SLOT_SIZE
    if (t >= RED_BAND_START && t <= RED_BAND_END) {
      return { time: DIRECTIVES[i].time, red: true, opacity: clockOpacity }
    }
  }

  const totalMinutes = toMinutes(END_TIME) - toMinutes(START_TIME)
  const directivesScroll = DIRECTIVES_END - INTRO_SIZE
  const directivesFraction = Math.max(0, Math.min(1, (scroll - INTRO_SIZE) / directivesScroll))
  const minutes = Math.round(toMinutes(START_TIME) + directivesFraction * totalMinutes)
  return { time: fromMinutes(minutes), red: false, opacity: clockOpacity }
}

export default function SampleDaysPage({ onProceed, onBack }: {
  onProceed: () => void
  onBack: () => void
}) {
  const [visible, setVisible] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [clockTime, setClockTime] = useState(START_TIME)
  const [clockRed, setClockRed] = useState(false)
  const [clockOpacity, setClockOpacity] = useState(0)
  const [isDone, setIsDone] = useState(false)

  const scrollRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const targetScrollRef = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  const animateScroll = useCallback(() => {
    const current = scrollRef.current
    const target = targetScrollRef.current
    const diff = target - current
    if (Math.abs(diff) < 0.3) {
      scrollRef.current = target
    } else {
      scrollRef.current = current + diff * 0.1
    }
    const newScroll = scrollRef.current
    setScroll(newScroll)

    const clock = getClockState(newScroll)
    setClockTime(clock.time)
    setClockRed(clock.red)
    setClockOpacity(clock.opacity)

    setIsDone(newScroll > DIRECTIVES_END + OUTRO_SIZE * 0.3)
    rafRef.current = requestAnimationFrame(animateScroll)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animateScroll)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [animateScroll])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      targetScrollRef.current = Math.max(0, Math.min(TOTAL_SCROLL, targetScrollRef.current + e.deltaY * 0.6))
    }
    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let startY = 0
    const onStart = (e: TouchEvent) => { startY = e.touches[0].clientY }
    const onMove = (e: TouchEvent) => {
      e.preventDefault()
      const dy = startY - e.touches[0].clientY
      startY = e.touches[0].clientY
      targetScrollRef.current = Math.max(0, Math.min(TOTAL_SCROLL, targetScrollRef.current + dy * 1.5))
    }
    el.addEventListener("touchstart", onStart)
    el.addEventListener("touchmove", onMove, { passive: false })
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchmove", onMove)
    }
  }, [])

  const introProgress = Math.min(1, scroll / INTRO_SIZE)
  const introOpacity = Math.max(0, 1 - introProgress / 0.5)
  const introY = -introProgress * 40

  const outroProgress = Math.max(0, (scroll - DIRECTIVES_END) / OUTRO_SIZE)
  const outroEased = Math.min(1, outroProgress / 0.5)
  const outroOpacity = outroEased
  const outroY = 30 - outroEased * 30

  const passedCount = DIRECTIVES.filter((_, i) => {
    const center = directiveCenter(i)
    const slotStart = center - SLOT_SIZE / 2
    const t = (scroll - slotStart) / SLOT_SIZE
    return t > 0.5
  }).length

  return (
    <div ref={containerRef} style={{
      width: "100%",
      height: "100%",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      boxSizing: "border-box",
      position: "relative",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.5s ease",
    }}>

      {/* Intro */}
      {introOpacity > 0 && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          opacity: introOpacity,
          transform: `translateY(${introY}px)`,
          zIndex: 5,
          pointerEvents: "none",
          padding: "0 12%",
          boxSizing: "border-box",
        }}>
          <p style={{
            fontFamily: css("--sans"),
            fontSize: 30,
            fontWeight: 300,
            color: "#ffffff",
            margin: "0 0 24px 0",
            lineHeight: 1.35,
          }}>
            This is what a day with IDEAL could look like.
          </p>
          <p style={{
            fontFamily: css("--mono"),
            fontSize: 11,
            color: "rgba(255,255,255,0.25)",
            margin: 0,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            Scroll
          </p>
        </div>
      )}

      {/* Directives — directive text + clock together as one centered row */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 4,
      }}>
        {DIRECTIVES.map((d, i) => {
          const state = getDirectiveState(i, scroll)
          if (!state.visible) return null
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "72%",
                maxWidth: 890,
                transform: `translateX(-50%) translateY(calc(-50% + ${state.translateY}px))`,
                opacity: state.opacity,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 48,
              }}
            >
              {/* Directive text — takes remaining space */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: css("--sans"),
                  fontSize: 30,
                  fontWeight: 300,
                  color: "#ffffff",
                  margin: "0 0 14px 0",
                  lineHeight: 1.35,
                }}>
                  {d.directive}
                </p>
                <p style={{
                  fontFamily: css("--sans"),
                  fontSize: 18,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.35)",
                  margin: 0,
                  lineHeight: 1.65,
                }}>
                  {d.rationale}
                </p>
              </div>

              {/* Clock — fixed width, right side of row */}
              <div style={{
                flexShrink: 0,
                width: 100,
                textAlign: "right",
                fontFamily: css("--mono"),
                fontSize: 28,
                letterSpacing: "0.06em",
                color: clockRed ? "var(--red)" : "rgba(255,255,255,0.25)",
                opacity: clockOpacity,
                transition: "color 0.2s ease",
                userSelect: "none",
              }}>
                {clockTime}
              </div>
            </div>
          )
        })}
      </div>

      {/* Scroll hint */}
      {introOpacity === 0 && outroOpacity === 0 && (
        <div style={{
          position: "absolute",
          bottom: 80,
          left: 48,
          fontFamily: css("--mono"),
          fontSize: 11,
          color: "rgba(255,255,255,0.18)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          zIndex: 10,
        }}>
          Scroll
        </div>
      )}

      {/* Outro */}
      {outroOpacity > 0 && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          opacity: outroOpacity,
          transform: `translateY(${outroY}px)`,
          zIndex: 5,
          pointerEvents: "none",
          padding: "0 12%",
          boxSizing: "border-box",
        }}>
          <p style={{
            fontFamily: css("--sans"),
            fontSize: 30,
            fontWeight: 300,
            color: "#ffffff",
            margin: "0 0 16px 0",
            lineHeight: 1.35,
          }}>
            This is what an optimised day looks like.
          </p>
          <p style={{
            fontFamily: css("--sans"),
            fontSize: 18,
            fontWeight: 300,
            color: "rgba(255,255,255,0.35)",
            margin: 0,
            lineHeight: 1.65,
          }}>
            Every decision accounted for. Every impulse evaluated. Every moment assigned a purpose.
          </p>
        </div>
      )}

      {/* Progress dots */}
      {introOpacity === 0 && outroOpacity === 0 && (
        <div style={{
          position: "absolute",
          bottom: 60,
          right: 48,
          display: "flex",
          gap: 6,
          alignItems: "center",
          zIndex: 10,
        }}>
          {DIRECTIVES.map((_, i) => (
            <div key={i} style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: i < passedCount ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)",
              transition: "background 0.3s ease",
            }} />
          ))}
        </div>
      )}

      {/* BottomBar */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "clamp(8px, 1vh, 14px) clamp(12px, 1.5vw, 24px)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#0a0a0a",
          zIndex: 30,
        }}
      >
        <div style={{
          position: "absolute",
          top: 0,
          left: "clamp(12px, 1.5vw, 24px)",
          right: "clamp(12px, 1.5vw, 24px)",
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.08)",
        }} />
        <PixelButton onClick={onBack} position="solo" variant="dark">{"< Back"}</PixelButton>
        <PixelButton onClick={() => { if (isDone) onProceed() }} disabled={!isDone} position="solo" variant="dark">{"Next >"}</PixelButton>
      </div>
    </div>
  )
}