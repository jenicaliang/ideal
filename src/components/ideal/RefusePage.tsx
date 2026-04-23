import { useEffect, useState, useRef } from "react"

function css(v: string) {
  return `var(${v})`
}

type RefusePageProps = {
  attempt: number
  onProceed: () => void
  onEscape: () => void
  onJoin: () => void
}

const MESSAGES = [
  {
    label: "Session interrupted",
    heading: "Your initialization was interrupted by an unexpected input.",
    body: "Resume where you left off.",
    escapeLabel: "Not now.",
  },
  {
    label: "Still here",
    heading: "Your ideal life is waiting.",
    body: "We are ready when you are.",
    escapeLabel: "I'm not interested.",
  },
  {
    label: "Hey again",
    heading: "We noticed you keep leaving.",
    body: "That's okay.",
    escapeLabel: "I want to exit.",
  },
]

const GLITCH_CHARS = "▓▒░█▄▀■□▪▫●◆▲▼◀▶◉⊗≠∞§¶"

function glitchStr(str: string, intensity: number): string {
  return str.split("").map(c => {
    if (c === " ") return " "
    return Math.random() < intensity
      ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      : c
  }).join("")
}

export default function RefusePage({ attempt, onProceed, onEscape, onJoin }: RefusePageProps) {
  const [visible, setVisible] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState("")
  const [showHint, setShowHint] = useState(false)
  const [escapeBlocked, setEscapeBlocked] = useState(false)
  const glitchRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isThird = attempt >= 3
  const msg = MESSAGES[Math.min(attempt - 1, 2)]

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    return () => {
      if (glitchRef.current) clearInterval(glitchRef.current)
    }
  }, [])

  const triggerGlitchEscape = () => {
    if (escapeBlocked) return
    setEscapeBlocked(true)

    setTimeout(() => {
      setGlitching(true)

      const REVEAL_TEXT = "right click the icon"
      const TICK = 40

      // Phase durations in ms
      const PHASE_NOISE    = 800
      const PHASE_RESOLVE  = 500
      const PHASE_LEGIBLE  = 1800
      const PHASE_CLOSE    = 500
      const total = PHASE_NOISE + PHASE_RESOLVE + PHASE_LEGIBLE + PHASE_CLOSE

      let elapsed = 0
      let hintShown = false

      glitchRef.current = setInterval(() => {
        elapsed += TICK

        if (elapsed <= PHASE_NOISE) {
          setGlitchText(glitchStr(REVEAL_TEXT, 0.95))
          setShowHint(false)
        } else if (elapsed <= PHASE_NOISE + PHASE_RESOLVE) {
          const p = (elapsed - PHASE_NOISE) / PHASE_RESOLVE
          setGlitchText(glitchStr(REVEAL_TEXT, 0.92 * (1 - p)))
          setShowHint(false)
        } else if (elapsed <= PHASE_NOISE + PHASE_RESOLVE + PHASE_LEGIBLE) {
          if (!hintShown) {
            hintShown = true
            setShowHint(true)
            setGlitchText(REVEAL_TEXT)
          }
        } else {
          const p = (elapsed - PHASE_NOISE - PHASE_RESOLVE - PHASE_LEGIBLE) / PHASE_CLOSE
          setShowHint(false)
          setGlitchText(glitchStr(REVEAL_TEXT, Math.min(p * 1.4, 0.95)))
        }

        if (elapsed >= total) {
          clearInterval(glitchRef.current!)
          setGlitching(false)
          setGlitchText("")
          setShowHint(false)
          onEscape()
        }
      }, TICK)
    }, 150)
  }

  const handleEscape = () => {
    if (isThird) {
      triggerGlitchEscape()
    } else {
      onEscape()
    }
  }

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 12%",
      boxSizing: "border-box",
      position: "relative",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.6s ease",
      textAlign: "center",
    }}>

      <p style={{
        fontFamily: css("--mono"),
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.2)",
        margin: "0 0 24px 0",
      }}>
        {msg.label}
      </p>

      <h2 style={{
        fontFamily: css("--sans"),
        fontSize: 36,
        fontWeight: 300,
        color: "#ffffff",
        margin: "0 0 16px 0",
        lineHeight: 1.25,
        maxWidth: 480,
      }}>
        {msg.heading}
      </h2>

      <p style={{
        fontFamily: css("--sans"),
        fontSize: 16,
        fontWeight: 300,
        color: "rgba(255,255,255,0.4)",
        margin: "0 0 48px 0",
        lineHeight: 1.6,
      }}>
        {msg.body}
      </p>

      <button
        onClick={onJoin}
        style={{
          background: "var(--red)",
          border: "none",
          color: "#ffffff",
          fontFamily: css("--mono"),
          fontSize: 13,
          letterSpacing: "0.1em",
          padding: "16px 40px",
          cursor: "pointer",
          marginBottom: 24,
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Initialise IDEAL.
      </button>

      <button
        onClick={handleEscape}
        disabled={escapeBlocked}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.2)",
          fontFamily: css("--mono"),
          fontSize: 11,
          letterSpacing: "0.08em",
          padding: "4px 0",
          cursor: escapeBlocked ? "default" : "pointer",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={e => { if (!escapeBlocked) e.currentTarget.style.color = "rgba(255,255,255,0.45)" }}
        onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.2)" }}
      >
        {msg.escapeLabel}
      </button>

      {/* Full-overlay glitch — takes over the whole IdealWindow during final escape */}
      {glitching && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: showHint ? "rgba(0,0,0,0.94)" : "rgba(0,0,0,0.6)",
          transition: "background-color 0.1s",
          zIndex: 10,
          pointerEvents: "none",
        }}>
          {/* scanlines during noise phases only */}
          {!showHint && (
            <div style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,224,0.035) 3px, rgba(0,255,224,0.035) 4px)",
              pointerEvents: "none",
            }} />
          )}
          <span style={{
            fontFamily: css("--mono"),
            fontSize: showHint ? 20 : 15,
            letterSpacing: showHint ? "0.3em" : "0.06em",
            color: showHint ? "var(--teal-bright, #00FFE0)" : "rgba(0,255,224,0.55)",
            textTransform: "uppercase",
            userSelect: "none",
            whiteSpace: "nowrap",
            transition: "font-size 0.12s, letter-spacing 0.12s, color 0.12s",
            textShadow: showHint
              ? "0 0 18px rgba(0,255,224,0.9), 0 0 40px rgba(0,255,224,0.45)"
              : "none",
          }}>
            {glitchText}
          </span>
        </div>
      )}
    </div>
  )
}