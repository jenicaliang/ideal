import { useEffect, useState } from "react"

function css(v: string) {
  return `var(${v})`
}

const MESSAGES = [
  "Calibrating personal optimization matrix...",
  "You have made the most statistically optimal choice.",
]

export default function CTAPage({ onProceed, onRefuse }: {
  onProceed: () => void
  onRefuse: () => void
}) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  function handleStart() {
    setLoading(true)
    setMsgIndex(0)

    setTimeout(() => setMsgIndex(1), 1800)
    setTimeout(() => onProceed(), 4000)
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
      textAlign: "center",
    }}>

      {/* Main content */}
      <div style={{
        opacity: loading ? 0 : visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <p style={{
          fontFamily: css("--mono"),
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.2)",
          margin: "0 0 24px 0",
        }}>
          Initialisation
        </p>
        <h2 style={{
          fontFamily: css("--sans"),
          fontSize: 36,
          fontWeight: 300,
          color: "#ffffff",
          margin: "0 0 48px 0",
          lineHeight: 1.25,
          maxWidth: 480,
        }}>
          The onboarding process is complete. Are you ready to live your ideal life?
        </h2>
        <button
          onClick={handleStart}
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
          Let's start.
        </button>
        <button
          onClick={onRefuse}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.2)",
            fontFamily: css("--mono"),
            fontSize: 11,
            letterSpacing: "0.08em",
            padding: "4px 0",
            cursor: "pointer",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
        >
          Not now.
        </button>
      </div>

      {/* Loading message */}
      {loading && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          animation: "fadeIn 0.4s ease forwards",
        }}>
          <p style={{
            fontFamily: css("--mono"),
            fontSize: 13,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.5)",
            margin: 0,
            transition: "opacity 0.4s ease",
            opacity: msgIndex === 0 ? 1 : 0,
          }}>
            {MESSAGES[0]}
          </p>
          <p style={{
            fontFamily: css("--sans"),
            fontSize: 22,
            fontWeight: 300,
            color: "#ffffff",
            margin: 0,
            opacity: msgIndex === 1 ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}>
            {MESSAGES[1]}
          </p>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}