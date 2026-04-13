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
    label: "We noticed",
    heading: "We noticed you keep leaving.",
    body: "That's okay.",
    escapeLabel: "I want to leave.",
  },
]

const GLITCH_CHARS = "!@#$%^&*<>[]{}|\\/?;:~`"

function glitchStr(str: string, intensity: number): string {
  return str.split("").map(c => {
    if (c === " ") return " "
    return Math.random() < intensity
      ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
      : c
  }).join("")
}

export default function RefusePage({ attempt, onProceed, onEscape, onJoin}: RefusePageProps) {
  const [visible, setVisible] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [glitchText, setGlitchText] = useState("")
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

    // Small delay before glitch starts so the click registers visually
    setTimeout(() => {
      setGlitching(true)
      let frame = 0
      const totalFrames = 50 // ~2.5s at 50ms
      const revealText = "right click the icon"

      glitchRef.current = setInterval(() => {
        frame++
        const progress = frame / totalFrames

        if (progress < 0.3) {
          setGlitchText(glitchStr(revealText, 0.95))
        } else if (progress < 0.5) {
          setGlitchText(glitchStr(revealText, 0.7))
        } else if (progress < 0.65) {
          // Legible window
          setGlitchText(revealText)
        } else if (progress < 0.8) {
          setGlitchText(glitchStr(revealText, 0.5))
        } else {
          setGlitchText(glitchStr(revealText, 0.95))
        }

        if (frame >= totalFrames) {
          clearInterval(glitchRef.current!)
          setGlitching(false)
          setGlitchText("")
          onEscape() // close window after glitch
        }
      }, 50)
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

      {/* Glitch text overlay — appears during final escape sequence */}
      {glitching && (
        <div style={{
          position: "absolute",
          bottom: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: css("--mono"),
          fontSize: 13,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          animation: "glitchFlicker 0.08s infinite",
        }}>
          {glitchText}
        </div>
      )}

      <style>{`
        @keyframes glitchFlicker {
          0%  { opacity: 1; }
          49% { opacity: 1; }
          50% { opacity: 0.2; }
          100%{ opacity: 1; }
        }
      `}</style>
    </div>
  )
}